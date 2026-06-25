const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Transaction must have a source account'],
        index:true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'account',
        required: [true, 'Transaction must have a destination account'],
        index:true
    },
    status: {
        type: String,
        enum: {
            values: ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
            message: 'Status must be PENDING, COMPLETED, FAILED, or REVERSED'
        },
        default: 'PENDING'
    },
    amount: {
        type: Number,
        required: [true, 'Transaction amount is required'],
        min: [0, 'Amount must be a positive number']
    },
    idempotencyKey:{
        type:String,
        require:[true,"idempotencyKey is require for transaction"],
        index:true,
        unique:true
        
    }
    
    
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

module.exports = TransactionModel;