import HomeButton from "../../components/HomeButton.jsx";
import {useSelector} from "react-redux";
import ResetPasswordForm from "./components/ResetPasswordForm.jsx";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function ResetPassword(){

    const appLoading = useSelector((state)=>state.appFeature.appLoading)

    return(
        <div className={`${appLoading ? "pointer-events-none" : ""} relative bg-[#F0F0F0] h-screen w-screen flex items-center justify-center`}>
            {/*  Change Page Title  */}
            <SiteTitleUpdator page={"Reset Password | "}/>

            {/*  Home Button  */}
            <HomeButton/>

            {/*  Submit Email Form  */}
            <ResetPasswordForm/>
        </div>
    )
}

export default ResetPassword;