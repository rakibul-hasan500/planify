import {useDispatch} from "react-redux";
import {useGetUserDataQuery} from "../redux/features/user-panel/auth/authApi.js";
import {useEffect} from "react";
import {handleUserDataLoading, setAppSettingData, setUserData} from "../redux/features/app/appFunction/appSlice.js";
import {RouterProvider} from "react-router";
import {useGetAppDataQuery} from "../redux/features/admin-panel/setting/settingApi.js";

function AppWrapper({router}){

    const dispatch = useDispatch();

    // Call Get User Data API
    const {data: userData, isLoading: userDataLoading} = useGetUserDataQuery()

    // Set User Data To Redux
    useEffect(() => {
        if(userData?.data){
            dispatch(setUserData(userData?.data))
        }else{
            dispatch(setUserData(null))
        }
    }, [userData, dispatch]);

    // Set User Data Loading To Redux
    useEffect(() => {
        dispatch(handleUserDataLoading(userDataLoading))
    }, [userDataLoading, dispatch]);

    // Get App Setting Data
    const {data: appSettingData} = useGetAppDataQuery()

    // Set App Setting Data
    useEffect(() => {
        if(appSettingData?.data){
            dispatch(setAppSettingData(appSettingData?.data))
        }
    }, [appSettingData, dispatch]);

    return <RouterProvider router={router}/>
}


export default AppWrapper;