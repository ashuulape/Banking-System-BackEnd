const express = require('express');
const  Middelware  = require('../middleware/auth.middleware');
const router = express.Router();
const AccountController=require('../controller/account.controller')


router.post('/',Middelware.authMiddelware,AccountController.createAccountController)



module.exports = router;