const express = require('express');
const  Middelware  = require('../middleware/auth.middleware');
const router = express.Router();
const AccountController=require('../controller/account.controller')


router.post('/',Middelware.authMiddelware,AccountController.createAccountController)
router.get('/',Middelware.authMiddelware,AccountController.getAllAccountsController)


module.exports = router;