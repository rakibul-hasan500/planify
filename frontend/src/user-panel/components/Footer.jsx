import {useSelector} from "react-redux";

function Footer(){

    // App Setting
    const appSettingData = useSelector((state)=>state.appFeature.appSettingData);

    return(
        <footer className="border-t border-white/30 bg-black">
            <div className="max-w-[1040px] mx-auto px-4 pt-6 pb-5 text-center text-white">
                <p className="text-[15px] font-light">© {new Date().getFullYear()} {appSettingData?.siteName || "Site Name"}. All rights reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;