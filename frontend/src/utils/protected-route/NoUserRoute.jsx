import {useSelector} from "react-redux";
import {Navigate} from "react-router";
import Loader from "../../common/components/Loader.jsx";

function NoUserRoute({children}){

    // Get User Data & Loading From Redux
    const userData = useSelector((state)=>state.appFeature.userData)
    const userDataLoading = useSelector((state)=>state.appFeature.userDataLoading)

    if(userDataLoading) return <Loader/>

    // If No User Data
    if(userData) return <Navigate to="/" replace/>

    return children
}




export default NoUserRoute;