import {useResponseHandler} from "../../utils/useResponseHandler.jsx";
import {useLoginWithGoogleMutation} from "../../redux/features/user-panel/auth/authApi.js";
import {GoogleLogin} from "@react-oauth/google";
import {useNavigate} from "react-router";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {handleToggleAppLoading} from "../../redux/features/app/appFunction/appSlice.js";

function GoogleSignupButton(){

    const navigate = useNavigate();

    const dispatch = useDispatch();

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Call Login With Google API
    const [loginWithGoogle, {isLoading: loginWithGoogleLoading}] = useLoginWithGoogleMutation()
    useEffect(() => {
        dispatch(handleToggleAppLoading(loginWithGoogleLoading))
    }, [loginWithGoogleLoading, dispatch]);

    return(
        <div className="mt-3">
            <GoogleLogin
                onSuccess={async (credentialResponse)=>{
                    try{
                        const token = credentialResponse.credential;
                        const response = await loginWithGoogle({token}).unwrap();
                        navigate('/', {replace: true})
                        window.location.reload()
                        return successResponse(response)
                    }catch(error){
                        return errorResponse(error)
                    }
                }}
                // onError={()=>console.log("Failed!")}
                shape="rectangular"
                text="continue_with"
                width={364}
                logo_alignment="center"
                theme="outline"
                size="large"
            />
        </div>
    )
}

export default GoogleSignupButton;