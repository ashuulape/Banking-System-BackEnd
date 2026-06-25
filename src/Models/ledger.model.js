const mongoose=require('mongoose')

const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'account',
        required:[true,'ledger must conatin with account'],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,'ledger must conatin with amount'],
        immutable:true,
        index:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'transaction',
        required:[true,'ledger must conatin with transaction'],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:['DEBIT','CREDIT'],
            message:'ledger type must be DEBIT or CREDIT'},
        require:[true,'ledger type is required'],
        index:true,
        immutable:true
    }
    
})


const preventLedgerModification=()=>{
    throw new Error("Leadger entries cannot be modified.")
}

ledgerSchema.pre(['updateOne','findOneAndUpdate','findByIdAndUpdate','remove','deleteMany','findOneAndDelete','findOneAndReplace'],preventLedgerModification)

const ledgerModel=mongoose.model('ledger',ledgerSchema)

module.exports=ledgerModel