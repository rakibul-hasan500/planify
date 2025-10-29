import SignupFormCard from "./components/SignupFormCard.jsx";
import HomeButton from "../../components/HomeButton.jsx";
import {useSelector} from "react-redux";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function Signup(){

    const appLoading = useSelector((state)=>state.appFeature.appLoading);

    return(
        <div className={`${appLoading ? "pointer-events-none" : ""} relative bg-[#F0F0F0] h-screen w-screen flex items-center justify-center`}>
            {/*  Change Page Title  */}
            <SiteTitleUpdator page={"Sign Up | "}/>

            {/*  Home Navigate Button  */}
            <HomeButton/>

            {/*  Signup Form Card  */}
            <SignupFormCard/>
        </div>
    )
}

export default Signup;