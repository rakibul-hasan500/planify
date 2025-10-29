import OtpVerifyFormCard from "./components/OtpVerifyFormCard.jsx";
import HomeButton from "../../components/HomeButton.jsx";
import {useSelector} from "react-redux";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function VerifyAccount(){

    const appLoading = useSelector((state)=>state.appFeature.appLoading);

    return(
        <div className={`${appLoading ? "pointer-events-none" : ""} relative bg-[#F0F0F0] h-screen w-screen flex items-center justify-center`}>
            {/*  Change Page Title  */}
            <SiteTitleUpdator page={"Verify Account | "}/>

            {/*  Home Navigate Button  */}
            <HomeButton/>

            {/*  Otp Verify Form Card  */}
            <OtpVerifyFormCard/>
        </div>
    )
}

export default VerifyAccount;

