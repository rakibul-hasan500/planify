import {useSelector} from "react-redux";
import {Navigate} from "react-router";
import Loader from "../../common/components/Loader.jsx";
import PageNotFound from "../../common/pages/PageNotFound.jsx";

function AdminRoute({children}){

    // Get User Data & Loading From Redux
    const userData = useSelector((state)=>state.appFeature.userData)
    const userDataLoading = useSelector((state)=>state.appFeature.userDataLoading)

    if(userDataLoading) return <Loader/>

    // If Not Loged In
    if(!userData) return <PageNotFound/>

    // If Loged In & Not Admin
    if(userData && userData.role !== "admin") return <PageNotFound/>

    return children
}




export default AdminRoute;