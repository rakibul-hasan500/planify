const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    name: {type: String, required: true},

    email: {type: String, unique: true, required: true},

    password: {type: String, default: null},

    authProvider: {type: String, enum: ['email', 'google'], default: 'email'},

    role: {type: String, default: 'user', enum: ['user', 'admin'], required: true},

    otp: {type: String, default: null},

    otpExpiresAt: {type: Date, default: null},

    wrongOtpCount: {type: Number, default: 0},

    blockExpiresAt: {type: Date, default: null},

    isVerified: {type: Boolean, default: false, required: true},

}, {timestamps: true})




const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel