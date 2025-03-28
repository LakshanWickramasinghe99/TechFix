// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 }, 
  isAccountVerified: { type: Boolean, default: false }, 
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 }, 
}, {
  timestamps: true
});

userSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email already exists'));
  } else {
    next(error);
  }
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
