import {createBrowserRouter} from "react-router";
import App from "../App.jsx";
import Signup from "../user-panel/pages/signup/Signup.jsx";
import VerifyAccount from "../user-panel/pages/verify-account/VerifyAccount.jsx";
import Login from "../user-panel/pages/login/Login.jsx";
import UserRoute from "../utils/protected-route/UserRoute.jsx";
import AdminRoute from "../utils/protected-route/AdminRoute.jsx";
import AdminApp from "../admin-panel/AdminApp.jsx";
import NoUserRoute from "../utils/protected-route/NoUserRoute.jsx";
import PageNotFound from "../common/pages/PageNotFound.jsx";
import ForgotPassword from "../user-panel/pages/forgot-password/ForgotPassword.jsx";
import ResetPassword from "../user-panel/pages/reset-password/ResetPassword.jsx";
import Home from "../user-panel/pages/home/Home.jsx";
import Setting from "../admin-panel/pages/setting/Setting.jsx";
import User from "../admin-panel/pages/users/User.jsx";


const router = createBrowserRouter([
    // User Panel Routes
    {
        path: "/",
        element: <App/>,
        children: [
            {index: true, element: <UserRoute><Home/></UserRoute>}
        ]
    },

    // User Auth Routes
    {path: "login", element: <NoUserRoute><Login/></NoUserRoute>},
    {path: "signup", element: <NoUserRoute><Signup/></NoUserRoute>},
    {path: "verify-account", element: <NoUserRoute><VerifyAccount/></NoUserRoute>},
    {path: "forgot-password", element: <NoUserRoute><ForgotPassword/></NoUserRoute>},
    {path: "reset-password", element: <NoUserRoute><ResetPassword/></NoUserRoute>},




    // Admin Routes
    {
        path: "admin",
        element: <AdminRoute><AdminApp/></AdminRoute>,
        children: [
            {index: true, element: <Setting/>},
            {path: "users", element: <User/>}
        ],
    },





    // 404 Not Found
    {path: "*", element: <PageNotFound/>}
])






export default router;