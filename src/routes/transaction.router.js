
const {Router} = require('express');
const middelWare=require('../middleware/auth.middleware')
const transactionController=require('../controller/transaction.controller')


const transactionRoutes=Router()

transactionRoutes.post("/send",middelWare.authMiddelware,transactionController.createTransaction)

transactionRoutes.post("/checkbalance",transactionController.checkUserBalance)




transactionRoutes.post('/system/initial-funds',middelWare.authSystemUserMiddleware ,transactionController.initalfundsTransaction)

module.exports = transactionRoutes;