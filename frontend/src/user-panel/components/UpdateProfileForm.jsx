import {IoMdClose} from "react-icons/io";
import {useDispatch, useSelector} from "react-redux";
import {
    getUpdateProfileFormError,
    handleUpdateProfileFormClose
} from "../../redux/features/user-panel/auth/authSlice.js";
import {useEffect, useState} from "react";
import {useResponseHandler} from "../../utils/useResponseHandler.jsx";
import {useUpdateProfileMutation} from "../../redux/features/user-panel/auth/authApi.js";
import {updateProfileSchema} from "../../utils/zodValidation.js";
import {PulseLoader} from "react-spinners";

function UpdateProfileForm(){

    // Redux
    const dispatch = useDispatch();
    const userData = useSelector((state)=>state.appFeature.userData);
    const updateProfileFormError = useSelector((state)=>state.authFeature.updateProfileFormError);

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // form States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        if(userData){
            setName(userData.name);
            setEmail(userData.email);
        }
    }, [userData]);

    // Call Update Profile API
    const [updateProfile, {isLoading: updateProfileLoading}] = useUpdateProfileMutation()

    // Handle Update User Profile
    const handleSubmitUpdateUserProfileForm = async (e)=>{
        // Stop Reload On Submit
        e.preventDefault()

        // Reset Errors
        dispatch(getUpdateProfileFormError(""))

        try{
            // Get User Data
            const data = {
                name
            }

            // If Name Is Eampty
            if(data.name === ""){
                return dispatch(getUpdateProfileFormError("Enter your name."))
            }else{
                dispatch(getUpdateProfileFormError(""))
            }

            // Zod Validation
            const validation = updateProfileSchema.safeParse(data);

            // If Zod Validation Error
            if(!validation.success){
                // Get Zod Error
                const zodError = validation.error;

                // All Errors
                let allErrors = [];
                if(zodError.issues && Array.isArray(zodError.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        fields: issue.path[0],
                        message: issue.message,
                    }));
                }

                // Show Error
                dispatch(getUpdateProfileFormError(allErrors[0].message))

                return
            }

            // Get Data From Validation
            const userData = validation.data

            // Hit Update Profile API
            const response = await updateProfile(userData).unwrap()

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    return(
        <div className="fixed top-0 left-0 bg-white/20 h-screen w-screen flex items-center justify-center">
            <form onSubmit={(e)=>handleSubmitUpdateUserProfileForm(e)} className="bg-[#1F2938] w-[calc(100vw-50px)] max-w-[460px] p-8">
                {/*  Title & Close Button  */}
                <div className="text-white flex items-center justify-between">
                    {/*  Form Title  */}
                    <h4 className="text-[22px] font-semibold">Update Profile</h4>

                    {/*  Close Form  */}
                    <IoMdClose onClick={()=>dispatch(handleUpdateProfileFormClose())} className="text-2xl cursor-pointer"/>
                </div>

                {/*  Input Fields  */}
                <div className="flex flex-col gap-[14px] mt-6">
                    {/*  Name  */}
                    <div>
                        <label htmlFor="name" className="text-white/50 text-sm">Name</label>
                        <input value={name} onChange={(e)=>setName(e.target.value)} className="w-full p-3 bg-white/10 rounded outline-none border border-white/10 text-white" id="name"/>
                        {updateProfileFormError !== "" && <p className="text-red-500 text-sm">{updateProfileFormError}</p>}
                    </div>

                    {/*  Email  */}
                    <div>
                        <label className="text-white/50 text-sm">Email</label>
                        <h4 className="w-full p-3 bg-white/10 rounded outline-none border border-white/10 text-white">{email || "Not loged in"}</h4>
                    </div>

                    {/*  Role  */}
                    <div>
                        <label className="text-white/50 text-sm">Role</label>
                        <h4 className="w-full p-3 bg-white/10 rounded outline-none border border-white/10 text-white">{userData?.role || "Not loged in"}</h4>
                    </div>

                    {/*  Submit Button  */}
                    <button disabled={userData?.name === name || updateProfileLoading} type="submit" className="text-white p-[10px] rounded cursor-pointer font-semibold bg-black border border-white/30 mt-3">
                        {
                            updateProfileLoading ? <PulseLoader size={6} color="#fff"/> : "Update"
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdateProfileForm;