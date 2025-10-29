const jwt = require('jsonwebtoken')
const { errorResponse } = require('../../utils/responseHandler')
const UserModel = require('../models/user.model')


const verifyAuth = async (req, res, next)=>{
    try{
        // Get Access & Refresh Token
        const token = req.cookies.accessToken
        const refreshToken = req.cookies.refreshToken

        // Refresh User Token
        if(!token || !refreshToken){
            // Check Refresh Token Exist
            if(!refreshToken){
                return errorResponse(res, 403, 'Please log in to continue.')
            }

            // Verify refresh token
            const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);
            if(!decodedRefresh){
                return errorResponse(res, 401, 'Session expired. Log in again.')
            }

            // Generate New Access Token & Save To Cookie
            const newAccessToken = jwt.sign(
                { userId: decodedRefresh.userId },
                process.env.JWT_SECRET,
                { expiresIn: '15m' }
            );
            res.cookie('accessToken', newAccessToken, {
                maxAge: 15 * 60 * 1000,
                httpOnly: true,
                secure: process.env.APPLICATION_MODE === 'development' ? false : true,
                sameSite: process.env.ORIGIN === process.env.SERVER ? 'strict' : 'none'
            })

            // Set New Token As Access Token
            req.cookies.accessToken = newAccessToken
        }

        // Decode Token
        const decoded = jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET)
        if(!decoded.userId){
            return errorResponse(res, 401, 'Session expired. Log in again.')
        }

        // Get User Data
        const user = await UserModel.findById(decoded.userId).select('-password -otp -otpExpiresAt -wrongOtpCount -blockExpiresAt -isVerified -createdAt -updatedAt -__v -authProvider')
        if(!user){
            return errorResponse(res, 404, 'User not found.')
        }

        // Send User Id
        req.user = user

        next()
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}




module.exports = verifyAuth