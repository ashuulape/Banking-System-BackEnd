const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  username: {
    type: String,
    required: [true, 'name is required for creating account'],
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false
  },
}, {
  timestamps: true
});

userSchema.pre('save', async function () {
  try {
    if (!this.isModified("password")) {   
      return ;
    }
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return ;
  } catch (err) {
    return err;
  }
});



const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;