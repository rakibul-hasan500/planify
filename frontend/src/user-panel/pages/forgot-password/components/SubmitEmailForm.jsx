import {useState} from "react";
import {useResponseHandler} from "../../../../utils/useResponseHandler.jsx";
import {useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {PulseLoader} from "react-spinners";
import {useForgotPasswordEmailSubmitMutation} from "../../../../redux/features/user-panel/auth/authApi.js";
import {getForgotPasswordEmailError} from "../../../../redux/features/user-panel/auth/authSlice.js";
import {forgotPasswordEmailSubmitSchema} from "../../../../utils/zodValidation.js";

function SubmitEmailForm(){

    const navigate = useNavigate();

    // Redux
    const dispatch = useDispatch();
    const forgotPasswordEmailError = useSelector((state)=>state.authFeature.forgotPasswordEmailError)

    // Form State
    const [email, setEmail] = useState('');

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Call Submit Forgot Password Email Form API
    const [forgotPasswordEmailSubmit, {isLoading: forgotPasswordEmailSubmitLoading}] = useForgotPasswordEmailSubmitMutation()

    // Handle Submit Forgot Password Email Form
    const handleSubmitForgotPasswordEmailForm = async (e)=>{
        // Stop Reload On Form Submit
        e.preventDefault();

        // Reset Error
        dispatch(getForgotPasswordEmailError(""))

        try{
            const data = {
                email
            }

            // If Email Field Empty
            if(data.email === ""){
                if(data.email === ""){
                    dispatch(getForgotPasswordEmailError("Enter your email address."))
                }else{
                    dispatch(getForgotPasswordEmailError(""))
                }

                return
            }

            // Zod Validation
            const validation = forgotPasswordEmailSubmitSchema.safeParse(data);

            // If Zod Validation Error
            if(!validation.success){
                // Get Zod Error
                const zodError = validation.error;

                // Get All Errors
                let allErrors = []
                if(zodError?.issues && Array.isArray(zodError?.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        field: issue.path[1],
                        message: issue.message,
                    }))
                }

                // Set Error Message
                dispatch(getForgotPasswordEmailError(allErrors[0]?.message || ""))

                return
            }

            // Get Data From Zodd
            const userData = validation.data

            // Hit Submit Forgot Password Email Form API
            const response = await forgotPasswordEmailSubmit(userData).unwrap()

            // Navigate To OTP Verify Page
            navigate("/reset-password", {replace: true})

            return successResponse(response)
        }catch(error){
            return errorResponse(error);
        }
    }

    return(
        <div className={`${forgotPasswordEmailSubmitLoading ? "pointer-events-none" : ""} h-screen sm:h-max w-screen sm:w-[420px] bg-white p-7 flex flex-col items-center justify-center`}>
            {/*  Form Title  */}
            <div className="max-w-[420px] w-full sm:w-full">
                <h3 className="font-semibold text-2xl text-center uppercase">Forgot</h3>
                <p className="text-gray-600 font-light text-center mt-2">Insert your email to set new password and recover account.</p>
            </div>

            {/*  Submit Email Form  */}
            <form onSubmit={(e)=>handleSubmitForgotPasswordEmailForm(e)} className="max-w-[420px] w-full sm:w-full mt-6 flex flex-col gap-6">
                {/*  Email & Error  */}
                <div>
                    {/*  Input & Label  */}
                    <div className="relative group">
                        <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato]"/>
                        <label htmlFor="email" className={`${email !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Email</label>
                    </div>

                    {/*  Error  */}
                    {forgotPasswordEmailError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{forgotPasswordEmailError}</p>}
                </div>

                {/*  Submit Button  */}
                <button disabled={forgotPasswordEmailSubmitLoading} type="submit" className={`${forgotPasswordEmailSubmitLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-lg font-semibold bg-[tomato] text-white p-2 flex items-center justify-center gap-2 h-[45px] -mt-1`}>
                    {
                        forgotPasswordEmailSubmitLoading ? <PulseLoader size={6} color="#fff"/> : <span>Submit Email</span>
                    }
                </button>
            </form>
        </div>
    )
}

export default SubmitEmailForm;