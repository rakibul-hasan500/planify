const jwt = require('jsonwebtoken')


// Generate Verify Token
const generateVerifyToken = async (res, user)=>{
    const verifyToken = jwt.sign(
        {email: user.email, userId: user._id.toString()},
        process.env.JWT_VERIFY_TOKEN_SECRET,
        {expiresIn: '7m'}
    )
    res.cookie('verifyToken', verifyToken, {
        maxAge: 7 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
}


// Generare Resend OTP Token
const generateResendOtpToken = async (res, user)=>{
    const resendOtpToken = jwt.sign(
        {email: user.email, userId: user._id.toString()},
        process.env.JWT_RESEND_OTP_TOKEN_SECRET,
        {expiresIn: '22m'}
    )
    res.cookie('resendOtpToken', resendOtpToken, {
        maxAge: 22 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
}

// Generate Password Reset Token
const generatePasswordRestToken = async (res, user)=>{
    const passwordRestToken = jwt.sign(
        {userId: user._id},
         process.env.JWT_RESET_PASSWORD_TOKEN_SECRET, {
        expiresIn: '10m'
    })
    res.cookie('passwordRestToken', passwordRestToken, {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
}


// Generate Access Token
const generateAccessToken = async (res, user)=>{
    const accessToken = jwt.sign(
        {userId: user._id},
         process.env.JWT_SECRET, {
        expiresIn: '15m'
    })
    res.cookie('accessToken', accessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
}


// Generate Refresh Token
const generateRefreshToken = async (res, user)=>{
    const refreshToken = jwt.sign(
        {userId: user._id}, 
        process.env.JWT_REFRESH_TOKEN_SECRET, {
        expiresIn: '15d'
    })
    res.cookie('refreshToken', refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
}








// Clear Verify Token
const clearTokenFromCookie = async (res, tokenName)=>{
    await res.clearCookie(tokenName, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
    })
}




module.exports = {
    generateVerifyToken,
    generateResendOtpToken,
    generatePasswordRestToken,
    generateAccessToken,
    generateRefreshToken,

    clearTokenFromCookie
}