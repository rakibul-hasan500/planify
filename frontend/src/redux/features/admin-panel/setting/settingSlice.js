import {createSlice} from "@reduxjs/toolkit";

const settingSlice = createSlice({
        name: "settingSlice",
        initialState: {

        // Setting Field Errors
        settingFieldErrors: {
            siteLogoError: "",
            logoAltTagError: "",
            siteNameError: "",
            siteTitleError: "",
            siteIconError: "",
            iconAltTagError: "",
        }
    },

    reducers: {
        // Get Setting Field Errors
        getSettingFieldError: (state, action)=>{
            if(action.payload.field === "siteLogo"){
                state.settingFieldErrors.siteLogoError = action.payload.errorMessage;
            }

            else if(action.payload.field === "logoAltTag"){
                state.settingFieldErrors.logoAltTagError = action.payload.errorMessage;
            }

            else if(action.payload.field === "siteName"){
                state.settingFieldErrors.siteNameError = action.payload.errorMessage;
            }

            else if(action.payload.field === "siteTitle"){
                state.settingFieldErrors.siteTitleError = action.payload.errorMessage;
            }

            else if(action.payload.field === "siteIcon"){
                state.settingFieldErrors.siteIconError = action.payload.errorMessage;
            }

            else if(action.payload.field === "iconAltTag"){
                state.settingFieldErrors.iconAltTagError = action.payload.errorMessage;
            }
        }

    }
})


export const {
    getSettingFieldError,
} = settingSlice.actions;
const settingReducer = settingSlice.reducer;
export default settingReducer;