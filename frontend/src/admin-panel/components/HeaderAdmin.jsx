import {FiUser} from "react-icons/fi";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router";
import {useLogOutUserMutation} from "../../redux/features/user-panel/auth/authApi.js";
import {useResponseHandler} from "../../utils/useResponseHandler.jsx";
import {clearUserData} from "../../redux/features/app/appFunction/appSlice.js";
import {handleUpdateProfileFormOpen} from "../../redux/features/user-panel/auth/authSlice.js";
import {VscThreeBars} from "react-icons/vsc";
import UpdateProfileForm from "../../user-panel/components/UpdateProfileForm.jsx";

function HeaderAdmin({setSidebarOpen}){

    const navigate = useNavigate();

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Redux
    const dispatch = useDispatch();
    const userData = useSelector((state)=>state.appFeature.userData)
    const appLoading = useSelector((state)=>state.appFeature.appLoading)
    const updateProfileFormOpen = useSelector((state)=>state.authFeature.updateProfileFormOpen)
    const appSettingData = useSelector((state)=>state.appFeature.appSettingData)

    // Call Logout User API
    const [logOutUser, {isLoading: logOutUserLoading}] = useLogOutUserMutation()

    // Handle Log Out User
    const handleLogOutUser = async ()=>{
        try{
            // Hit Logout User API
            const response = await logOutUser().unwrap()

            // Clear User Data
            dispatch(clearUserData())

            // Navigate To Login Page
            navigate('/login', {replace: true})

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    return(
        <header className={`${logOutUserLoading || appLoading ? "pointer-events-none" : ""} bg-[#1F2938] mx-auto`}>
            <div className="flex items-center justify-between max-w-[1040px] py-4 px-4 mx-auto">
                {/*  Hamburger  */}
                {userData && userData.role === "admin" &&<div className="text-white text-3xl md:hidden">
                    <VscThreeBars onClick={()=>setSidebarOpen((opened)=>!opened)} className="cursor-pointer"/>
                </div>}

                {/*  Logo  */}
                <Link to="/" className="max-h-[40px] max-w-[160px] overflow-hidden">
                    {
                        appSettingData?.siteLogo ? <img src={appSettingData?.siteLogo} alt={appSettingData?.logoAltTag} className="object-center object-cover"/> : <p className="text-white">Site Logo</p>
                    }
                </Link>

                {/*  Profile  */}
                <div className="relative group">
                    {/*  User Icon  */}
                    <div className="h-10 w-10 bg-white/30 rounded-full flex items-center justify-center cursor-pointer text-white">
                        {userData?.name[0] || <FiUser className="text-xl"/>}
                    </div>

                    {/*  Profile Details Card  */}
                    {userData && <div className="hidden group-hover:flex absolute top-full right-0 w-[380px] bg-gradient-to-r from-[#1E1E1E] to-[#111] border border-white/20 rounded-lg shadow-2xl backdrop-blur-xl text-white p-5  flex-col items-center justify-start gap-6 z-[9]">
                        {/* Profile Image & Info */}
                        <div className="flex items-center gap-4">
                            {/*  Profile Character  */}
                            <div className="w-16 h-20 rounded bg-gradient-to-tr bg-white/20 flex items-center justify-center text-2xl font-bold">
                                {userData?.name?.[0] || "U"}
                            </div>

                            {/*  Name, Email, Role  */}
                            <div>
                                <h2 className="text-lg font-semibold">{userData?.name || "User Name"}</h2>
                                <p className="text-gray-400 text-sm">{userData?.email || "user@email.com"}</p>
                                <span className="inline-block mt-1 px-3 py-1 rounded text-xs font-medium bg-white/20">{userData?.role || "user"}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button onClick={handleLogOutUser} className="px-4 py-2 bg-white/10 text-white text-xs rounded transition cursor-pointer">Log Out</button>

                            {userData?.role === "admin" && (
                                <Link to="/" className="px-4 py-2 bg-white/10 text-white text-xs rounded transition text-center">Home Page</Link>
                            )}

                            <button onClick={()=>dispatch(handleUpdateProfileFormOpen())} className="px-4 py-2 bg-white/10 text-white text-xs rounded transition text-center cursor-pointer">Edit Profile</button>
                        </div>
                    </div>}
                </div>

                {/*  Update user Form  */}
                {updateProfileFormOpen && <UpdateProfileForm/>}
            </div>
        </header>
    )
}

export default HeaderAdmin;