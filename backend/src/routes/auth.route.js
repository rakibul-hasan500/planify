const express = require('express')
const { registerUser, verifyAccount, resendOtp, otpExpireTime, loginUser, userProfile, logoutUser, forgotPasswoedEmailSubmit, resetPassword, loginWithGoogle, updateProfile, getUsers, deleteUser } = require('../controllers/auth.controller')
const verifyAuth = require('../middlewares/verifyLogin')
const verifyAdmin = require('../middlewares/verifyAdmin')
const router = express.Router()


// Register User
router.post('/signup', registerUser)


// Login User
router.post('/login', loginUser)


// Login With Google
router.post('/google', loginWithGoogle)


// Log Out User
router.post('/logout', verifyAuth, logoutUser)


// Verify User
router.post('/verify-account', verifyAccount)


// Resend OTP
router.post('/resend-otp', resendOtp)


// OTP Expire Time
router.get('/otp-expire-time', otpExpireTime)


// Forgot Passowrd Email Submit
router.post('/forgot-password-email-submit', forgotPasswoedEmailSubmit)


// Reset Passowrd
router.post('/reset-password', resetPassword)


// Update Profile
router.put('/update-profile', verifyAuth, updateProfile)


// Get All Users
router.get('/users', verifyAuth, verifyAdmin, getUsers)


// Delete User
router.delete('/user/:userId', verifyAuth, verifyAdmin, deleteUser)


// Get User Profile Data
router.get('/me', verifyAuth, userProfile)









module.exports = router