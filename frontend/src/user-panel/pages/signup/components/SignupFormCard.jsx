import {useDispatch, useSelector} from "react-redux";
import {IoMdEye, IoMdEyeOff} from "react-icons/io";
import {Link, useNavigate} from "react-router";
import {
    getSignupFormError,
    handleToggleConfirmPasswordShow,
    handleTogglePasswordShow
} from "../../../../redux/features/user-panel/auth/authSlice.js";
import {registerSchema} from "../../../../utils/zodValidation.js";
import {useState} from "react";
import {useRegisterUserMutation} from "../../../../redux/features/user-panel/auth/authApi.js";
import {PulseLoader} from "react-spinners";
import {useResponseHandler} from "../../../../utils/useResponseHandler.jsx";
import GoogleSignupButton from "../../../components/GoogleSignupButton.jsx";

function SignupFormCard(){

    const navigate = useNavigate()

    // Get Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Redux
    const dispatch = useDispatch();
    const passwordShow = useSelector((state)=>state.authFeature.passwordShow);
    const confirmPasswordShow = useSelector((state)=>state.authFeature.confirmPasswordShow);
    const signupFormErrors = useSelector((state)=>state.authFeature.signupFormErrors);

    // Form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Call Register User API
    const [registerUser, {isLoading: registerUserLoading}] = useRegisterUserMutation()

    // Handle Submit Register User Form
    const handleSubmitRegisterUserForm = async (e)=>{
        // Off Browser Reload
        e.preventDefault()

        // Reset All Error Messages
        dispatch(getSignupFormError({
            field: "name",
            errorMessage: "",
        }))
        dispatch(getSignupFormError({
            field: "email",
            errorMessage: "",
        }))
        dispatch(getSignupFormError({
            field: "password",
            errorMessage: "",
        }))
        dispatch(getSignupFormError({
            field: "confirmPassword",
            errorMessage: "",
        }))

        try{
            // Convert To a Object
            const data = {
                name,
                email,
                password,
                confirmPassword
            }

            // If Any Field Is Eampty
            if(data.name.length === 0 || data.email.length === 0 || data.password === "" || data.confirmPassword === ""){
                // Name Field Empty
                if(data.name.length === 0){
                    dispatch(getSignupFormError({
                        field: "name",
                        errorMessage: "Enter your name/",
                    }))
                }else{
                    dispatch(getSignupFormError({
                        field: "name",
                        errorMessage: "",
                    }))
                }

                // Email Field Empty
                if(data.email.length === 0){
                    dispatch(getSignupFormError({
                        field: "email",
                        errorMessage: "Enter your email address.",
                    }))
                }else{
                    dispatch(getSignupFormError({
                        field: "email",
                        errorMessage: "",
                    }))
                }

                // Password Field Empty
                if(data.password === ""){
                    dispatch(getSignupFormError({
                        field: "password",
                        errorMessage: "Enter your password.",
                    }))
                }else{
                    dispatch(getSignupFormError({
                        field: "password",
                        errorMessage: "",
                    }))
                }

                // Confirm Password Field
                if(data.confirmPassword === ""){
                    dispatch(getSignupFormError({
                        field: "confirmPassword",
                        errorMessage: "Confirm your password.",
                    }))
                }else{
                    dispatch(getSignupFormError({
                        field: "confirmPassword",
                        errorMessage: "",
                    }))
                }

                return;
            }

            // Validate By Zod Validator
            const validation = registerSchema.safeParse(data)

            // If Zod Validation Error
            if(!validation.success){
                // Get Error From Zod
                const zodError = validation.error

                // All Error Container
                let allErrors = []

                // Find Error Message & Field
                if(zodError?.issues && Array.isArray(zodError?.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        field: issue.path[0],
                        message: issue.message,
                    }))
                }

                // Reset All Errors
                dispatch(getSignupFormError({
                    field: "name",
                    errorMessage: "",
                }))
                dispatch(getSignupFormError({
                    field: "email",
                    errorMessage: "",
                }))
                dispatch(getSignupFormError({
                    field: "password",
                    errorMessage: "",
                }))
                dispatch(getSignupFormError({
                    field: "confirmPassword",
                    errorMessage: "",
                }))

                // Show Zod Error
                allErrors.forEach((error)=>{
                    dispatch(getSignupFormError({
                        field: error.field,
                        errorMessage: error.message,
                    }))
                })

                return;
            }else{
                dispatch(getSignupFormError({
                    field: "name",
                    errorMessage: "",
                }))
                dispatch(getSignupFormError({
                    field: "email",
                    errorMessage: "",
                }))
                dispatch(getSignupFormError({
                    field: "password",
                    errorMessage: "",
                }))
                dispatch(getSignupFormError({
                    field: "confirmPassword",
                    errorMessage: "",
                }))
            }

            // Get User Data From Validation
            const userData = validation.data

            // Hit Register User API
            const response = await registerUser(userData).unwrap()

            // Reset All States
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")

            // Navigate To Varify Account
            navigate("/verify-account", {
                replace: true,
                state: {
                    otpType: "signup"
                }
            })

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    return(
        <div className={`${registerUserLoading ? "pointer-events-none" : ""} h-screen sm:h-max w-screen sm:w-[420px] bg-white p-7 flex flex-col items-center justify-center`}>
            {/*  Form Title  */}
            <div className="max-w-[420px] w-full sm:w-full">
                <h3 className="font-semibold text-2xl text-center">SIGN UP</h3>
                <p className="text-gray-600 font-light text-center mt-2">Welcome, insert your details to signup.</p>
            </div>

            {/*  Form  */}
            <form onSubmit={(e)=>handleSubmitRegisterUserForm(e)} className="max-w-[420px] w-full sm:w-full mt-6 flex flex-col gap-6">
                {/*  Name & Error  */}
                <div>
                    {/*  Input & Label  */}
                    <div className="relative group">
                        <input id="name" type="text" value={name} onChange={(e)=>setName(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato]"/>
                        <label htmlFor="name" className={`${name !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Name</label>
                    </div>

                    {/*  Error  */}
                    {signupFormErrors.nameError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{signupFormErrors.nameError}</p>}
                </div>

                {/*  Email & Error  */}
                <div>
                    {/*  Input & Label  */}
                    <div className="relative group">
                        <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato]"/>
                        <label htmlFor="email" className={`${email !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Email</label>
                    </div>

                    {/*  Error  */}
                    {signupFormErrors.emailError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{signupFormErrors.emailError}</p>}
                </div>

                {/*  Password & Error  */}
                <div>
                    {/*  Password  */}
                    <div className="relative group">
                        {/*  Input & Label  */}
                        <input id="password" type={passwordShow ? "text" : "password"} value={password} onChange={(e)=>setPassword(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato] z-[9]"/>
                        <label htmlFor="password" className={`${password !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Password</label>

                        {/*  Password Show / Hide  */}
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xl text-gray-400 z-[10]">
                            {
                                passwordShow ?
                                    <IoMdEye
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleTogglePasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    /> :
                                    <IoMdEyeOff
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleTogglePasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    />
                            }
                        </div>
                    </div>

                    {/*  Error  */}
                    {signupFormErrors.passwordError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{signupFormErrors.passwordError}</p>}
                </div>

                {/*  Confirm Password & Error  */}
                <div>
                    {/*  Confirm Password  */}
                    <div className="relative group">
                        {/*  Input & Label  */}
                        <input id="confirm-password" type={confirmPasswordShow ? "text" : "password"}  value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} className="input-field p-[10px] border border-gray-300 outline-none w-full focus:border-[tomato] z-[9]"/>
                        <label htmlFor="confirm-password" className={`${confirmPassword !== "" && "top-[-0px]"} input-field-label absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-all duration-200 bg-white px-1 text-[14px] group-focus-within:top-[-0px] group-focus-within:text-[tomato] cursor-text`}>Confirm password</label>

                        {/*  Password Show / Hide  */}
                        <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xl text-gray-400 z-[10]">
                            {
                                confirmPasswordShow ?
                                    <IoMdEye
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleToggleConfirmPasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    /> :
                                    <IoMdEyeOff
                                        // onClick={()=>dispatch(handleTogglePasswordShow())}
                                        onMouseDown={(e)=>{
                                            e.preventDefault();
                                            dispatch(handleToggleConfirmPasswordShow());
                                        }}
                                        className="cursor-pointer"
                                    />
                            }
                        </div>
                    </div>

                    {/*  Error  */}
                    {signupFormErrors.confirmPasswordError !== "" && <p className="text-red-500 font-[500] text-[12px] mt-1">{signupFormErrors.confirmPasswordError}</p>}
                </div>

                {/*  Submit Button  */}
                <button disabled={registerUserLoading} type="submit" className={`${registerUserLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer"} text-lg font-semibold bg-[tomato] text-white p-2 flex items-center justify-center gap-2 h-[45px]`}>
                    {
                        registerUserLoading ? <PulseLoader size={6} color="#fff" className=""/> : <span>Sign up</span>
                    }
                </button>
            </form>

            {/*  Login  */}
            <div className="max-w-[420px] w-full sm:w-full text-gray-500 font-light flex items-center justify-center gap-1 mt-3">
                <span>Already have an account?</span>
                <Link to="/login" className="text-[tomato] font-semibold text-[15px]">Log In</Link>
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


export default SignupFormCard;