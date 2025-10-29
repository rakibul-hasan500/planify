import toast from "react-hot-toast";
import {useDispatch} from "react-redux";
import {
    getForgotPasswordEmailError,
    getLoginFormError, getResetPasswordFormErrors,
    getSignupFormError, getUpdateProfileFormError,
    getVerifyAccountFormError
} from "../redux/features/user-panel/auth/authSlice.js";
import {getTodoFormErrors} from "../redux/features/user-panel/todo/todoSlice.js";
import {getSettingFieldError} from "../redux/features/admin-panel/setting/settingSlice.js";

export function useResponseHandler(){
    // Redux
    const dispatch = useDispatch();

    // Success Response
    function successResponse(response){
        if(response.success === true){
            return toast.success(response?.message || "Success.")
        }
    }

    // Error Response
    function errorResponse(error){
        console.error(error)

        // If Error on Response & Signup Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "signup_zod_validation_error"){
            error?.data?.error?.forEach((error)=>{
                dispatch(getSignupFormError({
                    field: error.field,
                    errorMessage: error.message,
                }))
            })
            return
        }


        // If Error on Response & Login Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "login_zod_validation_error"){
            error?.data?.error?.forEach((error)=>{
                dispatch(getLoginFormError({
                    field: error.field,
                    errorMessage: error.message,
                }))
            })
            return
        }


        // If Error on Response & Verify Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "verify_zod_validation_error"){
            dispatch(getVerifyAccountFormError(error?.data?.error[0]?.message))
            return
        }


        // If Error on Response & Forgot Password Email Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "forgot_email_submit_zod_validation_error"){
            dispatch(getForgotPasswordEmailError(error?.data?.error[0]?.message))
            return
        }


        // If Error on Response & Signup Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "reset_password_zod_validation_error"){
            error?.data?.error?.forEach((error)=>{
                dispatch(getResetPasswordFormErrors({
                    field: error.field,
                    errorMessage: error.message,
                }))
            })
            return
        }


        // If Error on Response & Verify Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "update_zod_validation_error"){
            dispatch(getUpdateProfileFormError(error?.data?.error[0]?.message))
            return
        }


        // If Error on Response & Add Todos Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "add_todo_zod_validation_error"){
            error?.data?.error?.forEach((error)=>{
                dispatch(getTodoFormErrors({
                    field: error.field,
                    errorMessage: error.message,
                }))
            })
        }


        // If Error on Response & Setting Zod Validation Error
        if(error?.data?.success !== true && error?.data?.message === "setting_zod_validation_error"){
            error?.data?.error?.forEach((error)=>{
                dispatch(getSettingFieldError({
                    field: error.field,
                    errorMessage: error.message,
                }))
            })
        }





        // If Error on Response & Not Zod Validation Error
        if(
            error?.data?.success !== true &&
            ![
                "signup_zod_validation_error",
                "login_zod_validation_error",
                "verify_zod_validation_error",
                "forgot_email_submit_zod_validation_error",
                "reset_password_zod_validation_error",
                "add_todo_zod_validation_error",
                "setting_zod_validation_error"

            ].includes(error?.data?.message)){
            return toast.error(error?.data?.message || "Failed! Try again")
        }
    }

    return { successResponse, errorResponse }
}















