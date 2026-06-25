const express = require('express');
const router = express.Router();
const authcontroller = require('../controller/auth.controller.js');

// Register route
router.post('/register', authcontroller.register);

// Login route
router.post('/login', authcontroller.login);


module.exports = router; 