import HomeButton from "../../components/HomeButton.jsx";
import LoginFormCard from "./components/LoginFormCard.jsx";
import {useSelector} from "react-redux";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function Login(){

    const appLoading = useSelector((state)=>state.appFeature.appLoading);

    return(
        <div className={`${appLoading ? "pointer-events-none" : ""} relative bg-[#F0F0F0] h-screen w-screen flex items-center justify-center`}>
            {/*  Change Page Title  */}
            <SiteTitleUpdator page={"Login | "}/>

            {/*  Home Navigate Button  */}
            <HomeButton/>

            {/*  Login Form Card  */}
            <LoginFormCard/>
        </div>
    )
}

export default Login;