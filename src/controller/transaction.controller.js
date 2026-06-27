const mongoose=require('mongoose')
const transactionModel=require ('../Models/transaction.model')
const ledgerModel=require('../Models/ledger.model')
const emailService=require('../services/email.services')
const accountModel=require('../Models/account.model')




async function createTransaction(req, res) {

    /**
     * 1. Validate request
     */

    
    const { fromAccount, toAccount, amount,idempotencyKey } = req.body
    
    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "FromAccount, toAccount, amount and idempotencyKey are required"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount,
    })

    const toUserAccount = await accountModel.findOne({
        _id: toAccount,
    })

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount"
        })
    }

    /**
     * 2. Validate idempotency key
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETED") {
            return res.status(200).json({
                message: "Transaction already processed",
                transaction: isTransactionAlreadyExists
            })

        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(200).json({
                message: "Transaction is still processing",
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED") {
            return res.status(500).json({
                message: "Transaction processing failed, please retry"
            })
        }

        if (isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: "Transaction was reversed, please retry"
            })
        }
    }

    /**
     * 3. Check account status
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }

    /**
     * 4. Derive sender balance from ledger
     */
    const balance = await fromUserAccount.getBalance()

    if (balance < amount) {
        return res.status(400).json({
            message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
        })
    }

let transaction;
    try {

        const session = await mongoose.startSession()
        session.startTransaction()

        transaction = (await transactionModel.create([ {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        }] ,{session}))[ 0 ]

        await ledgerModel.create([ {
            account: fromAccount,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        } ], { session })

    await (() => {
        return new Promise((resolve) => setTimeout(resolve, 5 * 1000));
    })()

      

        await ledgerModel.create([ {
            account: toAccount,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        } ], { session })

        transaction.status = "COMPLETED";
        await transaction.save({ session });
   


        await session.commitTransaction()
        session.endSession()
    }
     catch (error) {

        return res.status(400).json({
            message: "Transaction is Pending due to some issue, please retry after sometime",
        })

    }
    /**
     * 10. Send email notification
     */
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

   
    const toAccountRecord = await accountModel.findById(toAccount).populate('user');
    let receiverEmail ;
    let receiverName ;
    if (toAccountRecord && toAccountRecord.user) {
        receiverEmail = toAccountRecord.user.email;
        receiverName = toAccountRecord.user.name || toAccountRecord.user.username || '';
    }

    await emailService.sendTransactionReceiverEmail(receiverEmail,receiverName,amount,toAccount )

    return res.status(201).json({
        message: "Transaction completed successfully",
        transaction: transaction
    })

}


async function initalfundsTransaction(req, res) {

    const { toAccount, amount, idempotencyKey } = req.body

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: 'All feilds are required' })
    }

    const toUserAccount = await accountModel.findOne({ _id: toAccount })

    if (!toUserAccount) {
        return res.status(404).json({ message: 'to Account not found' })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })
    if (!fromUserAccount) {
        return res.status(404).json({ message: ' systemUser Account not found' })
    }


    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const transaction = new transactionModel({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: 'PENDING'
        })

        // Save transaction first so it exists in the session before ledger entries
        await transaction.save({ session })

        // await ledgerModel.create([{
        //     account: fromUserAccount._id,
        //     transaction: transaction._id,
        //     type: 'DEBIT',
        //     amount: amount
        // }], { session })

        await ledgerModel.create([{
            account: toUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: 'CREDIT',
        }], { session })

        transaction.status = "COMPLETED"
        await transaction.save({ session })

        await session.commitTransaction()
        session.endSession()

        return res.status(200).json({
            message: 'Transaction created successfully',
            transaction
        })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        return res.status(500).json({
            message: 'Transaction failed, please retry',
            error: error.message
        })
    }

}



const checkUserBalance = async (req, res) => {

    // Get the account id from the logged-in user (req.user)
    // Find the account that belongs to the logged-in user
    let accountId;

    if (req.user && req.user._id) {
        // fetch the account for the logged-in user
        const account = await accountModel.findOne({ user: req.user._id });
        if (!account) {
            return res.status(404).json({ message: "Account for the logged-in user not found" });
        }
        accountId = account._id;
    } else {
        return res.status(400).json({ message: "User not authenticated" });
    }


   

    if (!accountId) {
        return res.status(400).json({ message: "Account ID is required" });
    }


    if (!mongoose.Types.ObjectId.isValid(accountId)) {
        return res.status(400).json({ message: "Invalid account ID" });
    }

    try {
        // Find the account
        
        const account = await accountModel.findById(accountId).populate('user');

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }


        // Get the balance using the account's method
        const balance = await account.getBalance();

        return res.status(200).json({ 
            accountId: account._id, 
            balance,
            username:account.user.username,
            email:account.user.email
        });
    } catch (error) {
        return res.status(500).json({ message: "Error checking balance", error: error.message });
    }
};


    



module.exports={createTransaction,initalfundsTransaction,checkUserBalance} 