import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        // Signup Form Errors
        signupFormErrors: {
            nameError: "",
            emailError: "",
            passwordError: "",
            confirmPasswordError: ""
        },
        // Signup Form Password Show / Hide
        passwordShow: false,
        confirmPasswordShow: false,



        // Login Form Errors
        loginFormErrors: {
            emailError: "",
            passwordError: "",
        },
        // Login Form Password Show Hide
        loginPasswordShow: false,



        // Verify Account Form Error
        verifyAccountFormError: "",



        // Forgot Password Email Form Error
        forgotPasswordEmailError: "",
        resetPasswordFormErrors: {
            otpError: "",
            passwordError: "",
            confirmPasswordError: "",
        },
        resetPasswordShow: false,
        resetConfirmPasswordShow: false,



        // Update Profile
        updateProfileFormOpen: false,
        updateProfileFormError: ""

    },
    reducers: {
        // Toggle Sighup Password
        handleTogglePasswordShow: (state)=>{
            state.passwordShow = !state.passwordShow;
        },

        // Toggle Sighup Confirm Password
        handleToggleConfirmPasswordShow: (state)=>{
            state.confirmPasswordShow = !state.confirmPasswordShow;
        },

        // Get Signup Form Errors
        getSignupFormError: (state, action)=>{
            if(action.payload.field === "name"){
                state.signupFormErrors.nameError = action.payload.errorMessage;
            }else if(action.payload.field === "email"){
                state.signupFormErrors.emailError = action.payload.errorMessage;
            }else if(action.payload.field === "password"){
                state.signupFormErrors.passwordError = action.payload.errorMessage;
            }else if(action.payload.field === "confirmPassword"){
                state.signupFormErrors.confirmPasswordError = action.payload.errorMessage;
            }
        },
        /////////////////////////////////////////////



        // Get Verify Account Form Error
        getVerifyAccountFormError: (state, action)=>{
            state.verifyAccountFormError = action.payload;
        },
        //////////////////////////////////////////////



        // Handle Toggle Login Password Show
        handleToggleLoginPasswordShow: (state)=>{
            state.loginPasswordShow = !state.loginPasswordShow;
        },

        // Get LoginForm Error
        getLoginFormError: (state, action)=>{
            if(action.payload.field === "email"){
                state.loginFormErrors.emailError = action.payload.errorMessage;
            }else if(action.payload.field === "password"){
                state.loginFormErrors.passwordError = action.payload.errorMessage;
            }
        },
        ///////////////////////////////////////////////




        // Get Forgot Password Email Error
        getForgotPasswordEmailError: (state, action)=>{
            state.forgotPasswordEmailError = action.payload;
        },

        // Toggle Forget Password Show
        handleToggleForgetPasswordShow: (state)=>{
            state.resetPasswordShow = !state.resetPasswordShow;
        },

        // Toggle Forget Confirm Password Show
        handleToggleForgetConfirmPasswordShow: (state)=>{
            state.resetConfirmPasswordShow = !state.resetConfirmPasswordShow;
        },

        // Get Reset Password Form Errors
        getResetPasswordFormErrors: (state, action)=>{
            if(action.payload.field === "otp"){
                state.resetPasswordFormErrors.otpError = action.payload.errorMessage;
            }else if(action.payload.field === "password"){
                state.resetPasswordFormErrors.passwordError = action.payload.errorMessage;
            }else if(action.payload.field === "confirmPassword"){
                state.resetPasswordFormErrors.confirmPasswordError = action.payload.errorMessage;
            }
        },





        // Handle Update Profile Form Open
        handleUpdateProfileFormOpen: (state)=>{
            state.updateProfileFormOpen = true;
        },

        // Handle Update Profile Form Close
        handleUpdateProfileFormClose: (state)=>{
            state.updateProfileFormOpen = false;
        },

        // Get Update Profile Form Error
        getUpdateProfileFormError: (state, action)=>{
            state.updateProfileFormError = action.payload;
        }


    }
})


export const {
    // Signup
    handleTogglePasswordShow,
    handleToggleConfirmPasswordShow,
    getSignupFormError,


    // Verify
    getVerifyAccountFormError,


    // Login
    handleToggleLoginPasswordShow,
    getLoginFormError,


    // Forgot
    getForgotPasswordEmailError,
    handleToggleForgetPasswordShow,
    handleToggleForgetConfirmPasswordShow,
    getResetPasswordFormErrors,



    // Update Profile
    handleUpdateProfileFormOpen,
    handleUpdateProfileFormClose,
    getUpdateProfileFormError

} = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer