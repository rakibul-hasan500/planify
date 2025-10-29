import {useSelector} from "react-redux";
import {useEffect} from "react";
import SiteTitleUpdator from "./SiteTitleUpdator.jsx";

function FabIconUpdator(){

    const appSettingData = useSelector((state)=>state.appFeature.appSettingData)

    // Change Fab Icon
    useEffect(() => {
        if(appSettingData?.siteIcon){
            let link = document.querySelector("link[rel*='icon']")
            if(!link){
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link)
            }
            link.href = appSettingData?.siteIcon || ""
        }
    }, [appSettingData]);

    // Change Title
    return <SiteTitleUpdator/>
}

export default FabIconUpdator;