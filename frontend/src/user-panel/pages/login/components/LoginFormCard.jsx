import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {
    getLoginFormError,
    handleToggleLoginPasswordShow,
} from "../../../../redux/features/user-panel/auth/authSlice.js";
import {PulseLoader} from "react-spinners";
import {Link, useNavigate} from "react-router";
import GoogleSignupButton from "../../../components/GoogleSignupButton.jsx";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useLoginUserMutation} from "../../../../redux/features/user-panel/auth/authApi.js";
import {useResponseHandler} from "../../../../utils/useResponseHandler.jsx";
import {loginSchema} from "../../../../utils/zodValidation.js";

function LoginFormCard(){

    const navigate = useNavigate();

    // Get Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Redux
    const dispatch = useDispatch();
    const loginPasswordShow = useSelector((state)=>state.authFeature.loginPasswordShow)
    const loginFormErrors = useSelector((state)=>state.authFeature.loginFormErrors)

    // User Data Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Call Login User API
    const [loginUser, {isLoading: loginUserLoading}] = useLoginUserMutation()

    // Handle Submit Login User Form
    const handleSubmitLoginUserForm = async (e)=>{
        // Stop Reload On Form Submit
        e.preventDefault()

        // Reset All Error Messages
        dispatch(getLoginFormError({
            field: "email",
            errorMessage: ""
        }))
        dispatch(getLoginFormError({
            field: "password",
            errorMessage: ""
        }))

        try{
            // Get User Data
            const data = {
                email,
                password,
            }

            // If Field Is Eampty
            if(data.email === "" || data.password === ""){
                // Email
                if(data.email === ""){
                    dispatch(getLoginFormError({
                        field: "email",
                        errorMessage: "Enter your email address."
                    }))
                }else{
                    dispatch(getLoginFormError({
                        field: "email",
                        errorMessage: ""
                    }))
                }

                // Password
                if(data.password === ""){
                    dispatch(getLoginFormError({
                        field: "password",
                        errorMessage: "Enter your password."
                    }))
                }else{
                    dispatch(getLoginFormError({
                        field: "password",
                        errorMessage: ""
                    }))
                }

                return
            }

            // Zod Validation
            const validation = loginSchema.safeParse(data);

            // Zod Validation Error
            if(!validation.success){
                // Get Zod Error
                const zodError = validation.error;

                // Get All Error As Array
                let allErrors = []
                if(zodError.issues && Array.isArray(zodError.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        field: issue.path[0],
                        message: issue.message,
                    }))
                }

                // Reset All Error Messages
                dispatch(getLoginFormError({
                    field: "email",
                    errorMessage: ""
                }))
                dispatch(getLoginFormError({
                    field: "password",
                    errorMessage: ""
                }))

                // Set Errors To Login Form Error
                allErrors.forEach((error)=>(
                    dispatch(getLoginFormError({
                        field: error.field,
                        errorMessage: error.message,
                    }))
                ))

                return
            }

            // Get User Data From Validation
            const userData = validation.data

            // Hit Login User API
            const response = await loginUser(userData).unwrap()

            // Reset User Form States
            setEmail("")
            setPassword("")

            // Navigate To Verify Account
            navigate("/verify-account", {
                replace: true,
                state: {otpType: "login"}
            })

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    return(
        <div className={`${loginUserLoading ? "pointer-events-none" : ""} h-screen sm:h-max w-screen sm:w-[420px] bg-white p-7 flex flex-col items-center justify-center`}>
            {/*  Form Title  */}
            <div className="max-w-[420px] w-full sm:w-full">
                <h3 className="font-semibold text-2xl text-center">LOGIN</h3>
                <p className="text-gray-600 font-light text-center mt-2">Welcome, insert your details to login.</p>
            </div>

            {/*  Form  */}
            <form onSubmit={(e)=>handleSubmitLoginUserForm(e)} className="max-w-[420px] w-full sm:w-full mt-6 flex flex-col gap-6">
                {/*  Email & Error  */}
                <div>
                    {/*  Input & Label  */}
                    <div className="relative group">
                        <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato]"/>
                        <label htmlFor="email" className={`${email !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Email</label>
                    </div>

                    {/*  Error  */}
                    {loginFormErrors.emailError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{loginFormErrors.emailError}</p>}
                </div>

                {/*  Password & Error || Forget Password Button  */}
                <div>
                    {/*  Password & Error  */}
                    <div>
                        {/*  Password  */}
                        <div className="relative group">
                            {/*  Input & Label  */}
                            <input id="password" type={loginPasswordShow ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato] z-[9]"/>
                            <label htmlFor="password" className={`${password !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Password</label>

                            {/*  Password Show / Hide  */}
                            <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xl text-gray-400 z-[10]">
                                {
                                    loginPasswordShow ?
                                        <IoMdEye
                                            // onClick={()=>dispatch(handleTogglePasswordShow())}
                                            onMouseDown={(e)=>{
                                                e.preventDefault();
                                                dispatch(handleToggleLoginPasswordShow());
                                            }}
                                            className="cursor-pointer"
                                        /> :
                                        <IoMdEyeOff
                                            // onClick={()=>dispatch(handleTogglePasswordShow())}
                                            onMouseDown={(e)=>{
                                                e.preventDefault();
                                                dispatch(handleToggleLoginPasswordShow());
                                            }}
                                            className="cursor-pointer"
                                        />
                                }
                            </div>
                        </div>

                        {/*  Error  */}
                        {loginFormErrors.passwordError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{loginFormErrors.passwordError}</p>}
                    </div>

                    {/*  Forget Password  */}
                    <div className="max-w-[420px] w-full sm:w-full text-gray-500 font-light flex items-center justify-end gap-1 mt-[6px]">
                        <Link to="/forgot-password" className="font-semibold text-[14px]">Forgot Password?</Link>
                    </div>
                </div>

                {/*  Submit Button  */}
                <button disabled={loginUserLoading} type="submit" className={`${loginUserLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-lg font-semibold bg-[tomato] text-white p-2 flex items-center justify-center gap-2 h-[45px] -mt-2`}>
                    {
                        loginUserLoading ? <PulseLoader size={6} color="#fff" className=""/> : <span>Login</span>
                    }
                </button>
            </form>

            {/*  Signup  */}
            <div className="max-w-[420px] w-full sm:w-full text-gray-500 font-light flex items-center justify-center gap-1 mt-4">
                <span>Do not have an account?</span>
                <Link to="/signup" className="text-[tomato] font-semibold text-[15px]">Sign up</Link>
            </div>

            {/*  Or  */}
            <div className="max-w-[420px] w-full sm:w-full flex gap-2 items-center mt-5">
                <div className="h-[2px] w-full bg-gray-200"></div>
                <p className="text-lg">or</p>
                <div className="h-[2px] w-full bg-gray-200"></div>
            </div>

            {/*  Signup with Google  */}
            <GoogleSignupButton/>
        </div>
    )
}

export default LoginFormCard;