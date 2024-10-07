const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "owner", "admin"],
    required: true,
  },
  profile: {
    fullName: String,
    avatarUrl: String,
    bio: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
