/*
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
*/

import mongoose from "mongoose";
import { countries } from "countries-list";

const addressSchema = new mongoose.Schema({
  _id: String, // Important for frontend-generated IDs
  type: { 
    type: String, 
    enum: ['Home', 'Work', 'Other'], 
    required: true 
  },
  streetNumber: { type: String, required: true },
  streetName: { type: String, required: true },
  city: { type: String, required: true },
  district: String,
  province: String,
  postalCode: String,
  country: { type: String, required: true },
  isPrimary: { type: Boolean, default: false }
}, { _id: false });

const purchaseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  item: String,
  quantity: Number,
  amount: Number,
  status: { type: String, enum: ['completed', 'pending', 'cancelled'], default: 'completed' }
});

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
  nickname: { type: String, default: "", maxlength: 30 },
  birthyear: { 
      type: Number, 
      default: null,
      min: 1900,
      max: new Date().getFullYear() 
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say', ''],
    default: ""
  },
  country: {
    type: String,
    default: ""
  },
  photo: String,
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 }, 
  isAccountVerified: { type: Boolean, default: false }, 
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
  addresses: [addressSchema],
  purchases: [purchaseSchema]
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
