const User = require('../Models/user.model.js');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const emailSerivce = require('../services/email.services.js');

// Register Controller
const register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with that email." });
    }

    // Create new user
    const user = await User.create({ email, username, password });

    const token = JWT.sign({ userId: user._id }, process.env.JWT_TOKEN);

    res.cookie('token', token);

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: user._id, email: user.email },
      token: token
    });

    await emailSerivce.sendRegistrationEmail(user.email , user.username )


   

  } catch (err) {
   
    res.status(401).json({ message: "Error registering user" });
    console.error(err);
    
    
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = JWT.sign({ userId: user._id }, process.env.JWT_TOKEN);

    res.cookie('token', token);

    res.status(200).json({ message: "Login successful", user: user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

module.exports = { register, login };