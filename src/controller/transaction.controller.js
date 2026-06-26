const mongoose=require('mongoose')
const transactionModel=require ('../Models/transaction.model')
const ledgerModel=require('../Models/ledger.model')
const emailService=require('../services/email.services')
const accountModel=require('../Models/account.model')



const createTransaction=async(req,res)=>{

    const{fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount||!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({message:'All feilds are required'})
    }


const fromUserAccount=await  accountModel.findOne({
    _id:fromAccount
})

const toUserAccount=await  accountModel.findOne({
    _id:toAccount
})

if(!fromUserAccount||!toUserAccount){
    return res.status(400).json({message:'User not found'})
}

const isTransanctinAlredyExist=await transactionModel.findOne({
    idempotencyKey:idempotencyKey
})

if(isTransanctinAlredyExist){
    switch (isTransanctinAlredyExist.status) {
        case "COMPLETED":
            return res.status(200).json({
                message: "transaction already completed",
                transaction: isTransanctinAlredyExist
            });
        case "PENDING":
            return res.status(200).json({
                message: "transaction is still processing",
            });
        case "FAILED":
            return res.status(500).json({
                message: "transaction is failed ,retry again",
            });
        case "REVERSED":
            return res.status(500).json({
                message: "transaction was reversed ,retry again",
            });
    }
}

if(fromUserAccount.status !=="ACTIVE" ||toUserAccount.status !== "ACTIVE"){
    return res.status(400).json({
        message:"one of them account is not active check again "
    })
}

const balance = await fromUserAccount.getBalance()

if(balance<amount){
    return res.status(400).json({
        message:`Insufficient Balence in . your balence is ${balance}`
    })
}



let transaction;
try {
    const session =await mongoose.startSession()
    session.startTransaction()

     transaction=await transactionModel.create([{
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session})

    await ledgerModel.create([{
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:'DEBIT'
    }],{session})

    await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:'CREDIT',
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()

    emailService.sendTransactionEmail(req.user.email ,req.user.username ,toUserAccount)

    return res.status(201).json({
        message:"transaction sucessfully"
    })
} catch (err) {
    await session.abortTransaction()
    return res.status(500).json({ message: err.message })
} finally {
    session.endSession()
}
}

const initalfundsTransaction=async (req,res)=>{

    const {toAccount,amount,idempotencyKey}=req.body
    
    if(!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({message:'All feilds are required'})
    }

    const toUserAccount=await accountModel.findOne({_id:toAccount});
   
    if(!toUserAccount){
        return res.status(404).json({message:'to Account not found'})
    }

    const fromUserAccount=await accountModel.findOne({
        user:req.user._id
    })
    if(!fromUserAccount){
        return res.status(404).json({message:' systemUser Account not found'})
    }


    const session =await mongoose.startSession();

    session.startTransaction()

    const transaction= new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:'PENDING'
    })

    const debitLeadgerEntry= await ledgerModel.create([{
        account:fromUserAccount._id,
        transaction:transaction._id,
        type:'DEBIT',
        amount:amount
    }],{session})


    const creditLeadgerEntry= await ledgerModel.create([{

            account:fromUserAccount._id,
            amount:amount,
            transaction:transaction._id,
            type:'CREDIT',
            
    }],{session})

    transaction.status="COMPLETED"
    await transaction.save({session})
    await session.commitTransaction()
    session.endSession()

    return res.status(200).json({

        message:'Transaction created successfully',
        transaction

    })

}


    



module.exports={createTransaction,initalfundsTransaction} 