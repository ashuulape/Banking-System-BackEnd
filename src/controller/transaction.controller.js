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

const isTransanctinAlredyExist=await transactionModel.find({
    idempotencyKey:idempotencyKeys
})

switch (isTransanctinAlredyExist.status) {
    case "COMPLETED":
         res.status(200).json({
            message: "transaction already completed",
            transaction: isTransanctinAlredyExist
        });
        break;
    case "PENDING":
        res.status(200).json({
            message: "transaction is still processing",
        });
        break;
    case "FAILED":
        res.status(500).json({
            message: "transaction is failed ,retry again",
        });
        break;
    case "REVERSED":
        res.status(500).json({
            message: "transaction was reversed ,retry again",
        });
        break;
}

if(fromUserAccount.status !=="ACTIVE" ||toUserAccount.status !== "ACTIVE"){
    return res.status(400).json({
        message:"one of them account is not active check again "
    })
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