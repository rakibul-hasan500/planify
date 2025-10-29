const { registerSchema, otpSchema, loginSchema, forgotPasswordEmailSubmitSchema, resetPasswordSchema, updateProfileSchema } = require("../../config/zod")
const { errorResponse, successResponse } = require("../../utils/responseHandler")
const sanitize = require('mongo-sanitize')
const {OAuth2Client} = require('google-auth-library')
const UserModel = require("../models/user.model")
const { hashValue, compareValue } = require("../../utils/bcrypt")
const jwt = require('jsonwebtoken')
const sendMail = require("../../config/sendMail")
const { otpEmailTemplate } = require("../../utils/htmlFileHandler")
const { generateVerifyToken, generateResendOtpToken, generateAccessToken, generateRefreshToken, clearTokenFromCookie } = require("../../utils/jwtTokenCookieHandler")


// Register User
const registerUser = async (req, res)=>{
    try{
        // Get Data From Body And Sanitize
        const sanitizedBody = sanitize(req.body)

        // Zod Validation
        const validation = registerSchema.safeParse(sanitizedBody)

        // If Validation Error
        if(!validation.success){
            const zodError = validation.error
            // console.log(zodError.issues);

            let allErrors = []
            if(zodError?.issues && Array.isArray(zodError?.issues)){
                allErrors = zodError?.issues?.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message || 'Validation error.'
                }))
            }

            return res.status(400).json({
                success: false,
                message: "signup_zod_validation_error",
                error: allErrors
            })
        }

        // Get User Infos From Validate
        const {name, email, password} = validation.data

        // Find Existing User
        const existingUser = await UserModel.findOne({email})
        if(existingUser){
            return errorResponse(res, 409, 'Email already registered. Use another email or login.')
        }

        // Hash Password & OTP
        const hashedPassword = await hashValue(password)
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOtp = await hashValue(otp)

        // Save Data To DB
        const user = await UserModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            authProvider: 'email',
            role: 'user',
            otp: hashedOtp,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
            isVerified: false
        })
        if(!user){
            return errorResponse(res, 500, 'Failed to register user. Please try again.')
        }

        // Generate Verify Token & Set To Cookie
        await generateVerifyToken(res, user)

        // Generate Resend OTP Token & Set To Cookie
        await generateResendOtpToken(res, user)

        // Subject, Html & Send Verify OTP Mail
        const subject = 'Verify your account with OTP.'
        const html = otpEmailTemplate().replace('{{OTP_CODE}}', otp)
        await sendMail({email, subject, html})

        return successResponse(res, 201, 'Registration successful. Verify your account via OTP.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Login User
const loginUser = async (req, res)=>{
    // Get Current Time
    const currentTime = new Date()

    try{
        // Get Data From Body & Sanitize
        const sanitizedBody = sanitize(req.body)

        // Validate With Zod Validator
        const validation = loginSchema.safeParse(sanitizedBody)

        // If Validation Not Success
        if(!validation.success){
            // Get Zod Errors
            const zodError = validation.error

            // Get All Errors
            let allErrors = []
            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }

            return res.status(400).json({
                success: false,
                message: "login_zod_validation_error",
                error: allErrors
            })
        }

        // Get User Data From Zod Validator
        const {email, password} = validation.data

        // Find User By Email
        const user = await UserModel.findOne({email})
        if(!user){
            return errorResponse(res, 404, 'User not found. Sign up first.')
        }
        if(user && user.password === null && user.authProvider === 'google'){
            return errorResponse(res, 400, 'Email is linked to a Google account. Log in with Google.')
        }

        // Check User Is Blocked Or Not
        if(user.blockExpiresAt && currentTime < user.blockExpiresAt){
            // Time Left
            const timeLeft = user.blockExpiresAt - currentTime

            // Hours, Minutes & Seconds
            const hour = Math.floor(timeLeft / (1000 * 60 * 60))
            const minute = Math.floor(timeLeft / (1000 * 60)) % 60
            const second = Math.floor(timeLeft / 1000) % 60

            // Unit
            let unit
            if(hour > 1) unit = 'hours'
            else if(hour === 1) unit = 'hour'
            else if(hour === 0 && minute > 1) unit = 'minutes'
            else if(hour === 0 && minute === 1) unit = 'minute'
            else if(hour === 0 && minute === 0 && second > 1) unit = 'seconds'
            else if(hour === 0 && minute === 0 && second === 1) unit = 'second'
            else unit = hour

            // Final Time
            const finalTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`

            return errorResponse(res, 403, `Account is temporarily blocked. Try again after ${finalTime} ${unit}.`)
        }

        // Match Password
        const comparePassword = await compareValue(password, user.password)
        if(!comparePassword){
            return errorResponse(res, 400, 'Invalid email or password.')
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedOtp = await hashValue(otp)
        
        // Generate Verify Token & Set To Cookie
        await generateVerifyToken(res, user)

        // Generate Resend OTP Token & Set To Cookie
        await generateResendOtpToken(res, user)

        // Send Email
        const subject = 'Verify your account with OTP.'
        const html = otpEmailTemplate().replace('{{OTP_CODE}}', otp)
        await sendMail({email: user.email, subject, html})

        // Save Data To DB
        user.otp = hashedOtp
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)
        user.wrongOtpCount = 0
        user.blockExpiresAt = null
        await user.save()

        return successResponse(res, 200, 'OTP sent to your email. Verify to continue.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Google Login
const loginWithGoogle = async (req, res)=>{
    try{
        // Get Google Client Id From .env
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

        // Get Token From Body
        const {token} = req.body
        if(!token){
            return errorResponse(res, 400, 'Google login data is missing. Please try again.')
        }

        // Verify Id Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        // Get Name & Email From Ticket
        const payload = ticket.getPayload()
        const {email, name} = payload

        // Check User Exist
        let existUser = await UserModel.findOne({email})
        if(existUser && existUser.authProvider === 'email'){
            return errorResponse(res, 400, 'Email is linked to an Email account. Log in with Email & Password.');
        }

        // If No User
        if(!existUser){
            const user = await UserModel.create({
                name,
                email,
                authProvider: 'google',
                isVerified: true
            })
            if(!user){
                return errorResponse(res, 500, 'Failed to login. Please try again.')
            }
            existUser = user
        }

        // Generate Access & Refresh Token
        await generateAccessToken(res, existUser)
        await generateRefreshToken(res, existUser)

        return successResponse(res, 200, 'Logged in successfully.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Log Out User
const logoutUser = async (req, res)=>{
    try{
        // Remove Access Token
        await clearTokenFromCookie(res, 'accessToken')
        
        // Remove Refresh Token
        await clearTokenFromCookie(res, 'refreshToken')
        
        return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Verify User
const verifyAccount = async (req, res)=>{
    // Get Current Time
    const currentTime = new Date()

    try{
        // Sanitize Body
        const sanitizedBody = sanitize(req.body)
        
        // OTP Validate By Zod
        const validation = otpSchema.safeParse(sanitizedBody)

        // If Zod Validation Error
        if(!validation.success){
            const zodError = validation.error

            let allErrors = []

            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }

            return res.status(400).json({
                success: false,
                message: "verify_zod_validation_error",
                error: allErrors
            })
        }

        // Get OTP
        const otp = validation.data.otp

        // Get Purpose & Validate
        const otpType = validation.data.otpType || ''
        if(otpType !== 'signup' && otpType !== 'login'){
            console.log(otpType)
            return errorResponse(res, 500, 'Something went wrong.')
        }

        // Get Verify Otp Token & Decode
        const verifyOtpToken = req.cookies.verifyToken
        let decodedToken
        if(verifyOtpToken){
            decodedToken = jwt.verify(verifyOtpToken, process.env.JWT_VERIFY_TOKEN_SECRET)
        }

        // If Verify OTP Token Not Exist
        if(!verifyOtpToken || !decodedToken.userId){
            return errorResponse(res, 401, 'Invalid or expired OTP verification token. Resend OTP.')
        }

        // Find User
        const user = await UserModel.findById(decodedToken.userId)
        if(!user){
            return errorResponse(res, 404, 'User not found. Sign up to continue.')
        }
        if(user && user.password === null && user.authProvider === 'google'){
            return errorResponse(res, 400, 'Email is linked to a Google account. Log in with Google.')
        }

        // Check Is Blocked
        if(user.blockExpiresAt && currentTime < new Date(user.blockExpiresAt)){
            const timeDifference = user.blockExpiresAt - currentTime
            const hour = Math.floor(timeDifference / (60 * 60 * 1000))
            const minutes = Math.floor(timeDifference / (60 * 1000)) % 60
            const seconds = Math.floor(timeDifference / 1000) % 60
            const attemptAgainAfter = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

            let unit = ''
            if(hour > 1) unit = 'hours'
            else if(hour === 1) unit = 'hour'
            else if(hour === 0 && minutes > 1) unit = 'minutes'
            else if(hour === 0 && minutes === 1) unit = 'minute'
            else if(hour === 0 && minutes === 0 && seconds > 1) unit = 'seconds'
            else if(hour === 0 && minutes === 0 && seconds === 1) unit = 'second'
            else unit = 'second';

            return errorResponse(res, 403, `Too many invalid OTP attempts. Try again after ${attemptAgainAfter} ${unit}.`)
        }

        // Otp Match & Expired
        const matchOtp = await compareValue(otp, user.otp)
        const expireTime = new Date(user.otpExpiresAt)

        // If Otp Expired
        if(expireTime < currentTime){
            return errorResponse(res, 400, 'OTP expired. Resend OTP.')
        }

        // If Wrong Otp
        if(!matchOtp){
            if(user.wrongOtpCount < 2){
                user.wrongOtpCount +=1
                await user.save()
            }else if(user.wrongOtpCount === 2){
                user.wrongOtpCount = 3
                user.blockExpiresAt = new Date(Date.now() + 60 * 60 * 1000)
                await user.save()
            }
            return errorResponse(res, 400, 'Invalid OTP. Try again.')
        }

        // Update Account Status
        user.otpExpiresAt = null
        user.otp = null
        user.wrongOtpCount = 0
        user.blockExpiresAt = null
        user.isVerified = true
        await user.save()

        // Delete Verify Otp & Resend Otp Token From Cookie
        await clearTokenFromCookie(res, 'verifyToken')
        await clearTokenFromCookie(res, 'resendOtpToken')

        // Login User - Verify Account
        if(otpType === 'login'){
            // Generate Access Token & Save To Cookie
            await generateAccessToken(res, user)

            // Generate Refresh Token
            await generateRefreshToken(res, user) 
            
            return successResponse(res, 200, 'Account verified successfully. You are now logged in.', {
                verifyFrom: otpType
            })
        }


        return successResponse(res, 200, 'Account verified successfully. Login now.', {
            verifyFrom: otpType
        })
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Resend OTP
const resendOtp = async (req, res)=>{
    // Get Current Time
    const currentTime = new Date()

    try{
        // Get Resend OTP Token
        const resendOtpToken = req.cookies.resendOtpToken
        
        // Decode Token
        let decodedToken
        if(resendOtpToken){
            decodedToken = jwt.verify(resendOtpToken, process.env.JWT_RESEND_OTP_TOKEN_SECRET)
        }
        
        // If No Token
        if(!resendOtpToken || !decodedToken){
            return errorResponse(res, 401, 'Invalid or expired OTP verification token. Sign up again.')
        }

        // Find User
        const user = await UserModel.findById(decodedToken.userId)
        if(!user){
            return errorResponse(res, 404, 'User not found. Sign up to continue.');
        }
        if(user && user.password === null && user.authProvider === 'google'){
            return errorResponse(res, 400, 'Email is linked to a Google account. Log in with Google.')
        }

        // Check Is Blocked
        if(user.blockExpiresAt && currentTime < new Date(user.blockExpiresAt)){
            const timeDifference = user.blockExpiresAt - currentTime
            const hour = Math.floor(timeDifference / (60 * 60 * 1000))
            const minutes = Math.floor(timeDifference / (60 * 1000)) % 60
            const seconds = Math.floor(timeDifference / 1000) % 60
            const attemptAgainAfter = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

            let unit = ''
            if(hour > 1) unit = 'hours'
            else if(hour === 1) unit = 'hour'
            else if(hour === 0 && minutes > 1) unit = 'minutes'
            else if(hour === 0 && minutes === 1) unit = 'minute'
            else if(hour === 0 && minutes === 0 && seconds > 1) unit = 'seconds'
            else if(hour === 0 && minutes === 0 && seconds === 1) unit = 'second'
            else unit = 'second';

            return errorResponse(res, 403, `Too many invalid OTP attempts. Try again after ${attemptAgainAfter} ${unit}.`)
        }
        
        // If OTP Not Expired
        if(user.otp && user.otpExpiresAt && new Date(user.otpExpiresAt) > currentTime){
            // Time Left
            const timeLeft = user.otpExpiresAt - currentTime

            // Minutes And Seconds
            const minutes = Math.floor(timeLeft / 1000 /60)
            const seconds = Math.floor((timeLeft / 1000) % 60)
            const finalTime = `${String(minutes).padStart(2, 0)}:${String(seconds).padStart(2, 0)}`

            let unit = ''
            if(minutes > 1) unit = 'minutes'
            else if(minutes === 1) unit = 'minute'
            else if(minutes === 0 && seconds > 1) unit = 'seconds'
            else if(minutes === 0 && seconds === 1) unit = 'second'
            else unit = 'minutes'

            return errorResponse(res, 400, `Please wait ${finalTime} ${unit} before requesting a new OTP.`)
        }

        // Generate New OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000)
        const hashedOtp = await hashValue(String(newOtp))

        // New Verify Token & Set To Cookie
        await generateVerifyToken(res, user)

        // Save New Data To DB
        user.otp = hashedOtp
        user.otpExpiresAt = new Date(currentTime.getTime() + 5 * 60 * 1000)
        await user.save()

        // Send Email
        const subject = 'Verify your account with OTP.'
        const html = otpEmailTemplate().replace('{{OTP_CODE}}', newOtp)
        sendMail({email: user.email, subject, html})

        return successResponse(res, 200, 'A new OTP has been sent successfully.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// OTP Expire Time
const otpExpireTime = async (req, res)=>{
    // Get Current Time
    const currentTime = new Date()

    try{
        // Check Access Or Refresh Token Exist
        if(req.cookies.accessToken || req.cookies.refreshToken){
            return null;
        }

        // Get Verify Otp Token & Decode
        const resendOtpToken = req.cookies.resendOtpToken
        let decodedToken
        if(resendOtpToken){
            decodedToken = jwt.verify(resendOtpToken, process.env.JWT_RESEND_OTP_TOKEN_SECRET)
        }

        // If Verify OTP Token Not Exist
        if(!resendOtpToken || !decodedToken.userId){
            return null
        }

        // Find User
        const user = await UserModel.findById(decodedToken.userId)
        if(!user){
            return errorResponse(res, 404, 'User not found. Sign up to continue.')
        }
        if(user && user.password === null && user.authProvider === 'google'){
            return errorResponse(res, 400, 'Email is linked to a Google account. Log in with Google.')
        }

        // Check Is Blocked
        if(user.blockExpiresAt && currentTime < new Date(user.blockExpiresAt)){
            return errorResponse(res, 403, 'User blocked for 1 hour.')
        }

        // Get Time
        let expireTime
        if(user.otp && user.otpExpiresAt){
            expireTime = user.otpExpiresAt
        }

        return successResponse(res, 200, 'OTP expire time.', expireTime)
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Forgot Password Email Submit
const forgotPasswoedEmailSubmit = async (req, res)=>{
    // Get Current Time
    const currentTime = new Date()

    try{
        // Sanitize Body
        const sanitizedBody = sanitize(req.body)

        // Zod Validation
        const validation = forgotPasswordEmailSubmitSchema.safeParse(sanitizedBody)

        // Zod Error
        if(!validation.success){
            // Get Zod Error
            const zodError = validation.error

            // Get All Errors
            let allErrors = []
            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }

            return res.status(400).json({
                success: false,
                message: 'forgot_email_submit_zod_validation_error',
                error: allErrors
            })
        }

        // Get Email From Validation
        const {email} = validation.data
        
        // Find User
        const user = await UserModel.findOne({email})
        if(!user){
            return errorResponse(res, 404, 'User not registered.')
        }
        if(user && user.password === null && user.authProvider === 'google'){
            return errorResponse(res, 400, 'Email is linked to a Google account. Log in with Google.')
        }

        // Check User Is Blocked
        if(user.blockExpiresAt && currentTime < new Date(user.blockExpiresAt)){
            return errorResponse(res, 403, 'Account is temporarily blocked. Try again later.')
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random()* 900000) 
        const hashedOtp = await hashValue(String(otp))

        // Generate Verify & Resend Otp Token
        await generateVerifyToken(res, user)
        await generateResendOtpToken(res, user)

        // Send Otp On Email
        const subject = 'Verify your account with OTP.'
        const html = otpEmailTemplate().replace('{{OTP_CODE}}', otp)
        await sendMail({email: user.email, subject, html})

        // Save Data To DB
        user.otp = hashedOtp
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000)
        user.wrongOtpCount = 0
        user.blockExpiresAt = null
        await user.save()

        return successResponse(res, 200, 'OTP sent to your email address.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Reset Password
const resetPassword = async (req, res)=>{
    // Get Current Time
    const currentTime = new Date()

    try{
        // Sanitize Body
        const sanitizedBody = sanitize(req.body)

        // Zod Validation
        const validation = resetPasswordSchema.safeParse(sanitizedBody)

        // Zod Validation Error
        if(!validation.success){
            // Zod Error
            const zodError = validation.error

            // All Error
            let allErrors = []
            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }


            return res.status(400).json({
                success: false,
                message: 'reset_password_zod_validation_error',
                error: allErrors
            })
        }

        // Get User Data From Validation
        const {otp, password} = validation.data
        
        // Get Verify Otp Token & Decode
        const verifyOtpToken = req.cookies.verifyToken
        let decodedToken
        if(verifyOtpToken){
            decodedToken = jwt.verify(verifyOtpToken, process.env.JWT_VERIFY_TOKEN_SECRET)
        }

        // If Verify OTP Token Not Exist
        if(!verifyOtpToken || !decodedToken.userId){
            return errorResponse(res, 401, 'Invalid or expired OTP verification token. Resend OTP.')
        }

        // Find User
        const user = await UserModel.findById(decodedToken.userId)
        if(!user){
            return errorResponse(res, 404, 'User not found. Sign up to continue.')
        }
        if(user && user.password === null && user.authProvider === 'google'){
            return errorResponse(res, 400, 'Email is linked to a Google account. Log in with Google.')
        }

        // Check Is Blocked
        if(user.blockExpiresAt && currentTime < new Date(user.blockExpiresAt)){
            const timeDifference = user.blockExpiresAt - currentTime
            const hour = Math.floor(timeDifference / (60 * 60 * 1000))
            const minutes = Math.floor(timeDifference / (60 * 1000)) % 60
            const seconds = Math.floor(timeDifference / 1000) % 60
            const attemptAgainAfter = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

            let unit = ''
            if(hour > 1) unit = 'hours'
            else if(hour === 1) unit = 'hour'
            else if(hour === 0 && minutes > 1) unit = 'minutes'
            else if(hour === 0 && minutes === 1) unit = 'minute'
            else if(hour === 0 && minutes === 0 && seconds > 1) unit = 'seconds'
            else if(hour === 0 && minutes === 0 && seconds === 1) unit = 'second'
            else unit = 'second';

            return errorResponse(res, 403, `Too many invalid OTP attempts. Try again after ${attemptAgainAfter} ${unit}.`)
        }

        // Otp Match & Expired
        const matchOtp = await compareValue(otp, user.otp)
        const expireTime = new Date(user.otpExpiresAt)

        // If Otp Expired
        if(expireTime < currentTime){
            return errorResponse(res, 400, 'OTP expired. Resend OTP.')
        }

        // If Wrong Otp
        if(!matchOtp){
            if(user.wrongOtpCount < 2){
                user.wrongOtpCount +=1
                await user.save()
            }else if(user.wrongOtpCount === 2){
                user.wrongOtpCount = 3
                user.blockExpiresAt = new Date(Date.now() + 60 * 60 * 1000)
                await user.save()
            }
            return errorResponse(res, 400, 'Invalid OTP. Try again.')
        }

        // Hash New Password
        const hashNewPassword = await hashValue(password)

        // Update Account Status
        user.otpExpiresAt = null
        user.otp = null
        user.wrongOtpCount = 0
        user.blockExpiresAt = null
        user.isVerified = true
        user.password = hashNewPassword
        await user.save()

        // Delete Verify Otp & Resend Otp Token From Cookie
        await clearTokenFromCookie(res, 'verifyToken')
        await clearTokenFromCookie(res, 'resendOtpToken')


        return successResponse(res, 200, 'Password reset successfully. You can now log in.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Update Profile
const updateProfile = async (req, res)=>{
    try{
        // Sanitize Body Data
        const sanitizedBody = sanitize(req.body)
        
        // Zod Validation
        const validation = updateProfileSchema.safeParse(sanitizedBody)

        // Get Data From Validation
        const {name} = validation.data

        // If Zod Validation Error
        if(!validation.success){
            // Get Zod Error
            const zodError = validation.error

            // All Errors
            let allErrors = []

            // Get All Errors From Zod.issue
            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }

            return res.status(400).json({
                success: false,
                message: 'update_zod_validation_error',
                error: allErrors
            })
        }

        // Get User
        const userId = req.user._id
        const user = await UserModel.findById(userId)
        
        // Update Data
        user.name = name
        await user.save()

        return successResponse(res, 200, 'User profile updated.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Get All Users
const getUsers = async (req, res)=>{
    try{
        // Get Search From Query and Sanitize
        const sanitizedQuery = sanitize(req.query)

        // Get Search From Sanitized
        const {search, page=1, limit=20} = sanitizedQuery

        // Filter
        let filter = {}
        if(search && search?.trim() !== ''){
            filter.name = {$regex: search.trim(), $options: 'i'}
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit)

        // Get All Users
        const users = await UserModel.find(filter).skip(skip).limit(Number(limit))

        // All Users Count
        const allUsersCount = await UserModel.countDocuments()

        return successResponse(res, 200, 'All users fetched successfully.', {
            users,
            allUsersCount
        })
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}


// Delete User
const deleteUser = async (req, res)=>{
    try{
        // Get User Id From Params
        const sanitizedUserId = sanitize(req.params)

        // Get User Id From Sanitize
        const {userId} = sanitizedUserId
        
        // If No Id
        if(!userId){
            return errorResponse(res, 400, 'Missing user ID.')
        }

        // Find User
        const user = await UserModel.findById(userId)
        if(!user){
            return errorResponse(res, 404, 'User not found.')
        }

        // Loged In User
        const currentUser = req.user

        // If User Same Account
        if(user.email === currentUser.email){
            return errorResponse(res, 400, 'You cannot delete your own account.')
        }

        // Onlu User Can Be Deleteable
        if(user.role !== 'user'){
            return errorResponse(res, 403, 'Only regular users can be deleted.')
        }

        // Delete User
        const result = await UserModel.findByIdAndDelete(userId)
        if(!result){
            return errorResponse(res, 500, 'Failed to delete user.')
        }

        return successResponse(res, 200, 'User deleted successfully.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}




// Get User Profile Details
const userProfile = async (req, res)=>{
    try{
        // Get User From Verify Auth
        const verifyAuthUser = req.user

        // Filter User
        const user = {
            name: verifyAuthUser.name,
            email: verifyAuthUser.email,
            role: verifyAuthUser.role
        }
        

        return successResponse(res, 200, 'User profile data.', user)
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}






















module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    loginWithGoogle,
    verifyAccount,
    resendOtp,
    resetPassword,
    otpExpireTime,
    forgotPasswoedEmailSubmit,
    updateProfile,
    getUsers,
    deleteUser,

    userProfile
}