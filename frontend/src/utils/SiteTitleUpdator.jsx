import {useSelector} from "react-redux";
import {useEffect} from "react";

function SiteTitleUpdator({page=""}){

    const appSettingData = useSelector((state)=>state.appFeature.appSettingData)

    // Change Title
    useEffect(() => {
        const pageName = `${page !== "" ? page : ""}`
        const siteName = appSettingData?.siteName || "Planify";
        const siteTitle = `${appSettingData?.siteTitle ? ` - ${appSettingData?.siteTitle}` : ""}`
        document.title = `${pageName}${siteName}${siteTitle}`
    }, [appSettingData, page]);

    return null

}

export default SiteTitleUpdator;