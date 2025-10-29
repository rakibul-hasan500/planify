import {PulseLoader} from "react-spinners";
import {useResponseHandler} from "../../../../utils/useResponseHandler.jsx";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {
    getResetPasswordFormErrors,
    handleToggleForgetConfirmPasswordShow,
    handleToggleForgetPasswordShow
} from "../../../../redux/features/user-panel/auth/authSlice.js";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router";
import {useResendOtpMutation, useResetPasswordMutation} from "../../../../redux/features/user-panel/auth/authApi.js";
import {resetPasswordSchema} from "../../../../utils/zodValidation.js";

function ResetPasswordForm(){

    const navigate = useNavigate()

    // Redux
    const dispatch = useDispatch();
    const resetPasswordShow = useSelector((state)=>state.authFeature.resetPasswordShow)
    const resetConfirmPasswordShow = useSelector((state)=>state.authFeature.resetConfirmPasswordShow)
    const resetPassworderrors = useSelector((state)=>state.authFeature.resetPasswordFormErrors)

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Form States
    const inputs = useRef([])
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // Handle On Change OTP Fields
    const handleOnChangeOTPFields = (index, e)=>{
        let value = e.target.value;

        inputs.current[index] = value

        if(value && index < inputs.current.length -1){
            inputs.current[index + 1].focus()
        }
    }

    // Auto Focus 0 Index
    useEffect(()=>{
        if(inputs.current.length > 0){
            inputs.current[0].focus()
        }
    }, [])

    // Call Reset Password API
    const [resetPassword, {isLoading: resetPasswordLoading}] = useResetPasswordMutation()

    // Handle Submit Reset Password Form
    const handleSubmitResetPasswordForm = async (e)=>{
        // Stop Reload On Form Submit
        e.preventDefault();

        // Reset Errors
        dispatch(getResetPasswordFormErrors({
            field: "otp",
            errorMessage: ""
        }))
        dispatch(getResetPasswordFormErrors({
            field: "password",
            errorMessage: ""
        }))
        dispatch(getResetPasswordFormErrors({
            field: "confirmPassword",
            errorMessage: ""
        }))

        try{
            // Get OTP
            const otpArray = inputs.current.map((input)=>input.value)
            const otp = otpArray.join("")

            // Make User Data Object
            const data = {
                otp,
                password,
                confirmPassword
            }

            // If Fields Empty
            if(data.otp === "" || data.password === "" || data.confirmPassword === ""){
                // OTP Error
                if(data.otp === ""){
                    dispatch(getResetPasswordFormErrors({
                        field: "otp",
                        errorMessage: "Enter the 6-digit OTP."
                    }))
                }else{
                    dispatch(getResetPasswordFormErrors({
                        field: "otp",
                        errorMessage: ""
                    }))
                }

                // Password Error
                if(data.password === ""){
                    dispatch(getResetPasswordFormErrors({
                        field: "password",
                        errorMessage: "Enter your new password."
                    }))
                }else{
                    dispatch(getResetPasswordFormErrors({
                        field: "password",
                        errorMessage: ""
                    }))
                }

                // OTP Error
                if(data.confirmPassword === ""){
                    dispatch(getResetPasswordFormErrors({
                        field: "confirmPassword",
                        errorMessage: "Confirm your password."
                    }))
                }else{
                    dispatch(getResetPasswordFormErrors({
                        field: "confirmPassword",
                        errorMessage: ""
                    }))
                }

                return
            }

            // Zod Validation
            const validation = resetPasswordSchema.safeParse(data);

            // If Zod Validation Error
            if(!validation.success){
                // Get Zod Error
                const zodError = validation.error

                // All Errors
                let allErrors = []
                if(zodError.issues && Array.isArray(zodError.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        field: issue.path[0],
                        message: issue.message
                    }))
                }

                // Set Errors
                allErrors.forEach((error)=>(
                    dispatch(getResetPasswordFormErrors({
                        field: error.field,
                        errorMessage: error.message
                    }))
                ))

                return
            }

            // Get Data From Validation
            const userData = validation.data

            // Hit Reset Password API
            const response = await resetPassword(userData).unwrap()

            // Reset States
            setPassword("")
            setConfirmPassword("")

            // Navigate To Login Page
            navigate("/login", {replace: true})

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    // Call Resend OTP API
    const [resendOtp, {isLoading: resendOtpLoading}] = useResendOtpMutation()

    // Handle Resend OTP
    const HandleResendOtp = async ()=>{
        try{
            // Hit Resend OTP Api
            const response = await resendOtp().unwrap()

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }


    return(
        <div className={`${resetPasswordLoading || resendOtpLoading ? "pointer-events-none" : ""} h-screen sm:h-max w-screen sm:w-[420px] bg-white p-7 flex flex-col items-center justify-center`}>
            {/*  Form Title  */}
            <div className="max-w-[420px] w-full sm:w-full">
                <h3 className="font-semibold text-2xl text-center uppercase">RESET PASSWORD</h3>
                <p className="text-gray-600 font-light text-center mt-2">Set your new password to secure your account.</p>
            </div>

            {/*  Submit Email Form  */}
            <form onSubmit={(e)=>handleSubmitResetPasswordForm(e)} className="max-w-[420px] w-full sm:w-full mt-6 flex flex-col gap-6">
                {/*  OTP Fields & Error  */}
                <div>
                    {/*  Label  */}
                    <label className="text-[13px] text-gray-500">OTP</label>

                    {/*  Fields  */}
                    <div className="w-full flex flex-wrap items-center justify-center sm:justify-between gap-4">
                        {[...Array(6)].map((_, index)=>(
                            <input
                                key={index}
                                ref={(element)=>inputs.current[index]=element}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                onChange={(e)=>handleOnChangeOTPFields(index, e)}
                                className="focus:outline-2 outline-[tomato] focus:border-0 h-11 w-11 border bg-gray-50 border-gray-300 rounded p-2 text-center text-xl"
                            />
                        ))}
                    </div>

                    {/*  Form Error  */}
                    {resetPassworderrors.otpError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{resetPassworderrors.otpError}</p>}
                </div>

                {/*  Password & Error  */}
                <div className="">
                    {/*  Password  */}
                    <div className="relative group">
                        {/*  Input & Label  */}
                        <input id="password" type={resetPasswordShow ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato] z-[9]"/>
                        <label htmlFor="password" className={`${password !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Password</label>

                        {/*  Password Show / Hide  */}
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xl text-gray-400 z-[10]">
                            {
                                resetPasswordShow ?
                                    <IoMdEye
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleToggleForgetPasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    /> :
                                    <IoMdEyeOff
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleToggleForgetPasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    />
                            }
                        </div>
                    </div>

                    {/*  Error  */}
                    {resetPassworderrors.passwordError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{resetPassworderrors.passwordError}</p>}
                </div>

                {/*  Confirm Password & Error  */}
                <div>
                    {/*  Confirm Password  */}
                    <div className="relative group">
                        {/*  Input & Label  */}
                        <input id="confirm-password" type={resetConfirmPasswordShow ? "text" : "password"}  value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato] z-[9]"/>
                        <label htmlFor="confirm-password" className={`${confirmPassword !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Confirm password</label>

                        {/*  Password Show / Hide  */}
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xl text-gray-400 z-[10]">
                            {
                                resetConfirmPasswordShow ?
                                    <IoMdEye
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleToggleForgetConfirmPasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    /> :
                                    <IoMdEyeOff
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleToggleForgetConfirmPasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    />
                            }
                        </div>
                    </div>

                    {/*  Error  */}
                    {resetPassworderrors.confirmPasswordError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{resetPassworderrors.confirmPasswordError}</p>}
                </div>

                {/*  Submit Button  */}
                <button disabled={resetPasswordLoading} type="submit" className={`${resetPasswordLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-lg font-semibold bg-[tomato] text-white p-2 flex items-center justify-center gap-2 h-[45px] -mt-1`}>
                    {
                        resetPasswordLoading ? <PulseLoader size={6} color="#fff" className=""/> : <span>Submit Email</span>
                    }
                </button>
            </form>

            {/*  Resend OTP  */}
            <div className="max-w-[420px] w-full sm:w-full mt-4 text-gray-600 flex items-center justify-center gap-1">
                <span>Didn't receive the OTP?</span>
                <button onClick={HandleResendOtp} className={`${resendOtpLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-[tomato] font-medium hover:underline`}>{resendOtpLoading ? "Sending..." : "Resend."}</button>
            </div>
        </div>
    )
}

export default ResetPasswordForm;