import HomeButton from "../../components/HomeButton.jsx";
import SubmitEmailForm from "./components/SubmitEmailForm.jsx";
import {useSelector} from "react-redux";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function ForgotPassword(){

    const appLoading = useSelector((state)=>state.appFeature.appLoading)

    return(
        <div className={`${appLoading ? "pointer-events-none" : ""} relative bg-[#F0F0F0] h-screen w-screen flex items-center justify-center`}>
            {/*  Change Page Title  */}
            <SiteTitleUpdator page={"Forgot Password | "}/>

            {/*  Home Button  */}
            <HomeButton/>

            {/*  Submit Email Form  */}
            <SubmitEmailForm/>
        </div>
    )
}

export default ForgotPassword;