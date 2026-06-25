
const {Router} = require('express');
const middelWare=require('../middleware/auth.middleware')
const transactionController=require('../controller/transaction.controller')


const transactionRoutes=Router()

transactionRoutes.post("/",middelWare.authMiddelware)


transactionRoutes.post('/system/initial-funds',middelWare.authSystemUserMiddleware ,transactionController.initalfundsTransaction)

module.exports = transactionRoutes;