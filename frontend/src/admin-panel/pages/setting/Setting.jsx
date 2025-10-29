import {BiSolidImageAdd} from "react-icons/bi";
import {useEffect, useState} from "react";
import {useResponseHandler} from "../../../utils/useResponseHandler.jsx";
import {useDispatch, useSelector} from "react-redux";
import {getSettingFieldError} from "../../../redux/features/admin-panel/setting/settingSlice.js";
import {useUpdateSettingMutation} from "../../../redux/features/admin-panel/setting/settingApi.js";
import {settingSchema} from "../../../utils/zodValidation.js";
import {PulseLoader} from "react-spinners";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function Setting(){

    // Redux
    const dispatch = useDispatch();
    const appLoading = useSelector((state)=>state.appFeature.appLoading);
    const settingFieldErrors = useSelector((state)=>state.settingFeature.settingFieldErrors)
    const appSettingData = useSelector((state)=>state.appFeature.appSettingData)

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Setting States
    const [siteLogo, setSiteLogo] = useState(null);
    const [logoAltTag, setLogoAltTag] = useState("");
    const [siteName, setSiteName] = useState("");
    const [siteTitle, setSiteTitle] = useState("");
    const [siteIcon, setSiteIcon] = useState(null);
    const [iconAltTag, setIconAltTag] = useState("");

    const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
    const [iconPreviewUrl, setIconPreviewUrl] = useState("");

    // Set App Setting Data To State
    useEffect(() => {
        if(appSettingData){
            setLogoPreviewUrl(appSettingData?.siteLogo || "")
            setIconPreviewUrl(appSettingData?.siteIcon || "")

            setLogoAltTag(appSettingData?.logoAltTag || "")
            setSiteName(appSettingData?.siteName || "")
            setSiteTitle(appSettingData?.siteTitle || "")
            setIconAltTag(appSettingData?.iconAltTag || "")
        }
    }, [appSettingData]);

    // Handle Select Site Logo
    const handleSelectSiteLogo = (e)=>{
        const file = e.target.files[0];
        setSiteLogo(file)
        setLogoPreviewUrl(URL.createObjectURL(file));
    }

    // Handle Select Site Icon
    const handleSelectSiteIcon = (e)=>{
        const file = e.target.files[0];
        setSiteIcon(file)
        setIconPreviewUrl(URL.createObjectURL(file))
    }

    // Call Update Setting API
    const [updateSetting, {isLoading: updateSettingLoading}] = useUpdateSettingMutation()

    // Handle Setting Form Submit
    const handleSettingFormSubmit = async (e)=>{
        // Stop Reload On Submit
        e.preventDefault();

        // Reset Errors
        dispatch(getSettingFieldError({
            field: "siteLogo",
            errorMessage: ""
        }))
        dispatch(getSettingFieldError({
            field: "siteName",
            errorMessage: ""
        }))
        dispatch(getSettingFieldError({
            field: "siteTitle",
            errorMessage: ""
        }))
        dispatch(getSettingFieldError({
            field: "siteIcon",
            errorMessage: ""
        }))
        dispatch(getSettingFieldError({
            field: "iconAltTag",
            errorMessage: ""
        }))
        dispatch(getSettingFieldError({
            field: "logoAltTag",
            errorMessage: ""
        }))

        try{
            // data
            const data = {
                siteLogo,
                logoAltTag,
                siteName,
                siteTitle,
                siteIcon,
                iconAltTag
            }

            // Get Setting Data
            const formData = new FormData()

            if(siteLogo) formData.append("siteLogo", siteLogo)
            formData.append("logoAltTag", logoAltTag || "")
            formData.append("siteName", siteName)
            formData.append("siteTitle", siteTitle || "")
            if(siteIcon) formData.append("siteIcon", siteIcon)
            formData.append("iconAltTag", iconAltTag || "")

            // Validate Fields
            if(siteName === ""){
                return dispatch(getSettingFieldError({
                    field: "siteName",
                    errorMessage: "Enter the site name."
                }))
            }

            // Zod Validation
            const validation = settingSchema.safeParse(data)

            // If Validation Error
            if(!validation.success){
                // Zod Error
                const zodError = validation.error

                // Get All Errors
                let allErrors = []
                if(zodError.issues && Array.isArray(zodError.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        field: issue.path[0],
                        message: issue.message,
                    }))
                }

                // Show All Errors
                allErrors.forEach((error)=>{
                    dispatch(getSettingFieldError({
                        field: error.field,
                        errorMessage: error.message
                    }))
                })

                return
            }

            // Clear All States
            setSiteLogo(null)
            setLogoAltTag("")
            setLogoPreviewUrl("")
            setSiteName("")
            setSiteTitle("")
            setSiteIcon(null)
            setIconAltTag("")
            setIconPreviewUrl("")

            // Hit Update Setting API
            const response = await updateSetting(formData).unwrap()

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    return(
        <div className={`${appLoading ? "pointer-events-none" : ""} w-full p-4`}>
            {/*  Change Page Title  */}
            <SiteTitleUpdator page={"Admin - Settings | "}/>

            {/*  Title  */}
            <h5 className="text-lg font-semibold text-black">Setting</h5>

            {/*  Form  */}
            <form onSubmit={handleSettingFormSubmit} className="flex flex-col gap-7 mt-10">
                {/*  Website Logo  */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-end">
                    {/*  Label  */}
                    <label className="font-semibold text-sm text-gray-500 min-w-[90px]">Site logo:</label>

                    {/*  Logo  */}
                    <div>
                        <div className="relative h-30 w-30 bg-gray-100 flex items-center justify-center border border-gray-300 cursor-pointer overflow-hidden">
                            {
                                logoPreviewUrl ?
                                    <img src={logoPreviewUrl} alt={logoAltTag || "logo"} className="h-full w-full object-cover object-center"/> :
                                    <BiSolidImageAdd className="text-5xl text-gray-400"/>
                            }

                            <input onChange={(e)=>handleSelectSiteLogo(e)} type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="h-full w-full absolute top-0 left-0 opacity-0 cursor-pointer"/>
                        </div>
                        {settingFieldErrors.siteLogoError !== "" && <p className="text-red-500 text-sm mt-[2px]">{settingFieldErrors.siteLogoError}</p>}
                    </div>
                </div>

                {/*  Logo Alt  */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                    {/*  Label  */}
                    <label className="font-semibold text-sm text-gray-500 min-w-[90px]">Logo Alt Tag:</label>

                    {/*  Alt  */}
                    <div>
                        <input value={logoAltTag} onChange={(e)=>setLogoAltTag(e.target.value)} type="text" className="px-3 py-2 bg-gray-100 border border-gray-300 outline-none w-[320px]"/>
                        {settingFieldErrors.logoAltTagError !== "" && <p className="text-red-500 text-sm mt-[2px]">{settingFieldErrors.logoAltTagError}</p>}
                    </div>
                </div>

                {/*  Website Name  */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center mt-8">
                    {/*  Label  */}
                    <label className="font-semibold text-sm text-gray-500 min-w-[90px]">Site Name:</label>

                    {/*  Name  */}
                    <div>
                        <input value={siteName} onChange={(e)=>setSiteName(e.target.value)} type="text" className="px-3 py-2 bg-gray-100 border border-gray-300 outline-none w-[320px]"/>
                        {settingFieldErrors.siteNameError !== "" && <p className="text-red-500 text-sm mt-[2px]">{settingFieldErrors.siteNameError}</p>}
                    </div>
                </div>

                {/*  Website Title  */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                    {/*  Label  */}
                    <label className="font-semibold text-sm text-gray-500 min-w-[90px]">Site Title:</label>

                    {/*  Title  */}
                    <div>
                        <input value={siteTitle} onChange={(e)=>setSiteTitle(e.target.value)} type="text" className="px-3 py-2 bg-gray-100 border border-gray-300 outline-none w-[320px]"/>
                        {settingFieldErrors.siteTitleError !== "" && <p className="text-red-500 text-sm mt-[2px]">{settingFieldErrors.siteTitleError}</p>}
                    </div>
                </div>

                {/*  Site Icon  */}
                <div className="flex gap-4 items-end mt-8">
                    {/*  Label  */}
                    <label className="font-semibold text-sm text-gray-500 min-w-[90px]">Site icon:</label>

                    {/*  Logo  */}
                    <div>
                        <div className="relative h-15 w-15 bg-gray-100 flex items-center justify-center border border-gray-300 cursor-pointer overflow-hidden">
                            {
                                iconPreviewUrl ?
                                    <img src={iconPreviewUrl} alt={iconAltTag || "icon"} className="h-full w-full object-cover object-center"/> :
                                    <BiSolidImageAdd className="text-2xl text-gray-400"/>
                            }
                            <input onChange={(e)=>handleSelectSiteIcon(e)} type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="h-full w-full absolute top-0 left-0 opacity-0 cursor-pointer"/>
                        </div>
                        {settingFieldErrors.siteIconError !== "" && <p className="text-red-500 text-sm mt-[2px]">{settingFieldErrors.siteIconError}</p>}
                    </div>
                </div>

                {/*  Icon Alt  */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
                    {/*  Label  */}
                    <label className="font-semibold text-sm text-gray-500 min-w-[90px]">Icon Alt Tag:</label>

                    {/*  Alt  */}
                    <div>
                        <input value={iconAltTag} onChange={(e)=>setIconAltTag(e.target.value)} type="text" className="px-3 py-2 bg-gray-100 border border-gray-300 outline-none w-[320px]"/>
                        {settingFieldErrors.iconAltTagError !== "" && <p className="text-red-500 text-sm mt-[2px]">{settingFieldErrors.iconAltTagError}</p>}
                    </div>
                </div>

                {/*  Save Button  */}
                <button type="submit" disabled={appLoading || updateSettingLoading} className="bg-black text-white px-4 py-2 text-sm cursor-pointer mt-4 min-w-[150px] w-[150px] flex items-center justify-center">{updateSettingLoading ? <PulseLoader size={5} color={"#fff"}/> : "Save changes"}</button>
            </form>
        </div>
    )
}

export default Setting;