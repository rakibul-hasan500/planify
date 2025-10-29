import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getVerifyAccountFormError} from "../../../../redux/features/user-panel/auth/authSlice.js";
import {
    useGetOtpExpireTimeQuery,
    useResendOtpMutation,
    useVerifyAccountMutation
} from "../../../../redux/features/user-panel/auth/authApi.js";
import {useResponseHandler} from "../../../../utils/useResponseHandler.jsx";
import {PulseLoader} from "react-spinners";
import {useLocation, useNavigate} from "react-router";

function OtpVerifyFormCard(){

    const navigate = useNavigate()

    // Get Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Redux
    const dispatch = useDispatch();
    const verifyAccountFormError = useSelector((state)=>state.authFeature.verifyAccountFormError)

    // Get OTP Type
    const location = useLocation();
    const {otpType} = location.state || ""

    // Input Fields
    const inputs = useRef([]);

    // Set Input Value & Focus Next Field
    const handleOnChange = (index, e)=>{
        let value = e.target.value;
        if (/^[0-9]?$/.test(value)) dispatch(getVerifyAccountFormError(""));

        if (!/^[0-9]?$/.test(value)) return inputs.current[index].value = "";
        if (!/^[0-9]?$/.test(value)) return dispatch(getVerifyAccountFormError("OTP must contain only numbers."));

        // Set Input Value
        inputs.current[index].value = value;

        // Focus Next Input
        if(value && index < inputs.current.length -1){
            inputs.current[index + 1].focus()
        }
    }

    // Default Focus on 0 Index
    useEffect(() => {
        inputs.current[0].focus()
    }, []);

    // Call Get OTP Expire Time API
    const {data: otpExpireTimeData, isLoading: otpExpireTimeLoading} = useGetOtpExpireTimeQuery()
    const [expireTime, setExpireTime] = useState(0)
    useEffect(()=>{
        if(otpExpireTimeData?.data){
            const interval = setInterval(()=>{
                const currentTime = new Date()
                const expireDate = new Date(otpExpireTimeData?.data)
                const timeLeft = expireDate - currentTime

                if(timeLeft <= 0){
                    clearInterval(interval)
                    setExpireTime(0)
                }else{
                    setExpireTime(timeLeft)
                }
            }, 1000)

            return ()=>clearInterval(interval)
        }
    }, [otpExpireTimeData])

    // Call Verify Account API
    const [verifyAccount, {isLoading: verifyAccountLoading}] = useVerifyAccountMutation()

    // Handle Submit Verify Account Form
    const handleSubmitVerifyAccountForm = async (e)=>{
        // Stop Page Reload
        e.preventDefault()

        // Reset Verify Otp Field Error
        dispatch(getVerifyAccountFormError(""))

        try{
            // Get Otp Array & Join And Convert To Number
            const otpArray = inputs.current.map((input)=>input.value)
            const otp = otpArray.join("")

            // Validate - If OTP Length = 0
            if(otp.length === 0){
                return dispatch(getVerifyAccountFormError("Enter the 6-digit OTP sent to your email."))
            }

            // Validate - If OTP Length > 0 && Length < 6
            if(otp.length > 0 && otp.length < 6){
                return dispatch(getVerifyAccountFormError("The OTP must be exactly 6 digits."))
            }

            // Hit Verify Account API
            const response = await verifyAccount({
                otp,
                otpType
            }).unwrap()

            // Navidate
            if(response?.data?.verifyFrom === "signup"){
                navigate("/login", {replace: true})
            }else if(response?.data?.verifyFrom === "login"){
                navigate("/", {replace: true})
                window.location.reload()
            }

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    // Call Resend OTP API
    const [resendOtp, {isLoading: resendOtpLoading}] = useResendOtpMutation()

    // Handle Resend OTP
    const handleResendOtp = async ()=>{
        try{
            // Hit Resend OTP API
            const response = await resendOtp().unwrap()

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    return(
        <div className={`${verifyAccountLoading || resendOtpLoading ? "pointer-events-none" : ""} bg-white h-screen sm:h-max w-screen sm:w-[420px] px-7 pt-7 pb-6 flex flex-col items-center justify-center`}>
            {/*  Form Title  */}
            <div className="max-w-[420px] w-full sm:w-full">
                <h3 className="font-semibold text-2xl text-center">VERIFY ACCOUNT</h3>
                <p className="text-gray-600 font-light text-center mt-2">Enter the 6-digit OTP sent to your email to verify your account.</p>
            </div>

            {/*  OTP Valid Timer  */}
            <div className="max-w-[420px] w-full sm:w-full mt-4 text-center font-[600] text-red-500 flex items-center justify-center">
                {
                    otpExpireTimeLoading ? <h6 className="bg-red-50 py-1 px-3 rounded-full w-max">00:00</h6> :
                    expireTime <= 0 ? <h6 className="bg-red-50 py-1 px-3 rounded-full w-max">Expired</h6> :
                        (()=>{
                            let minutes = Math.floor(expireTime / (1000 * 60) % 60)
                            let seconds = Math.floor(expireTime / (1000) % 60)
                            let timer = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

                            return <h6 className="bg-red-50 py-1 px-3 rounded-full w-max">{timer === "00:00" ? "Expired" : timer}</h6>
                        })()
                }
            </div>

            {/*  Form  */}
            <form onSubmit={handleSubmitVerifyAccountForm} className="verifyOtpForm max-w-[420px] w-full sm:w-full flex flex-col gap-7 mt-4">
                {/*  Fields & Error  */}
                <div className="">
                    {/*  Fields  */}
                    <div className="w-full flex flex-wrap items-center justify-center sm:justify-between gap-4">
                        {[...Array(6)].map((_, index)=>(
                            <input
                                key={index}
                                ref={(element)=>inputs.current[index]=element}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                onChange={(e)=>handleOnChange(index, e)}
                                // onKeyDown={(e)=>handleBackspaceClick(e, index)}
                                className="focus:outline-2 outline-[tomato] focus:border-0 h-11 w-11 bg-gray-100 border border-gray-400 rounded p-2 text-center text-xl"
                            />
                        ))}
                    </div>

                    {/*  Form Error  */}
                    {verifyAccountFormError !== "" && <p className="text-red-500 font-light text-center mt-5">{verifyAccountFormError}</p>}
                </div>

                {/*  Submit Button  */}
                <button disabled={verifyAccountLoading} type="submit" className={`${verifyAccountLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} w-full text-center text-lg font-semibold bg-[tomato] text-white p-2`}>
                    {
                        verifyAccountLoading ? <PulseLoader size={6} color="#fff" className=""/> : <span>Verify account</span>
                    }
                </button>
            </form>

            {/*  Resend OTP  */}
            <div className="max-w-[420px] w-full sm:w-full mt-4 text-gray-600 flex items-center justify-center gap-1">
                <span>Didn't receive the OTP?</span>
                <button onClick={handleResendOtp} className={`${resendOtpLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-[tomato] font-medium hover:underline`}>{resendOtpLoading ? "Sending..." : "Resend."}</button>
            </div>
        </div>
    )
}

export default OtpVerifyFormCard;