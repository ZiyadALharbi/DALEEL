const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  phoneNumber: String,
  profilePicture: String,
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
});

module.exports = mongoose.model('User', UserSchema);
