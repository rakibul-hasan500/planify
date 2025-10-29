import {createSlice} from "@reduxjs/toolkit";

const appSlice = createSlice({
    name: "appSlice",
    initialState: {
        // User Data
        userData: null,
        userDataLoading: false,

        // Anywhare loading Inside App
        appLoading: false,

        // App Setting Data
        appSettingData: null,

    },
    reducers: {

        // Handle Toggle Anywhare Loading
        handleToggleAppLoading: (state, action)=>{
            state.appLoading = action.payload ?? false;
        },

        // Set User Data
        setUserData: (state, action)=>{
            state.userData = action.payload || null;
        },

        // Clear User Data
        clearUserData: (state)=>{
            state.userData = null;
        },

        // Set User Data Loading
        handleUserDataLoading: (state, action)=>{
            state.userDataLoading = action.payload;
        },

        // Set App Setting Data
        setAppSettingData: (state, action)=>{
            state.appSettingData = action.payload;
        }

    }
})


export const {
    setUserData,
    clearUserData,
    handleUserDataLoading,

    handleToggleAppLoading,

    setAppSettingData,
} = appSlice.actions;
const appReducer = appSlice.reducer;
export default appReducer;