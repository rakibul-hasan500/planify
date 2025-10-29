import '../common/style.css'
import {Outlet} from "react-router";
import AdminSidebar from "./components/AdminSidebar.jsx";
import {useState} from "react";
import Footer from "../user-panel/components/Footer.jsx";
import HeaderAdmin from "./components/HeaderAdmin.jsx";

function AdminApp(){

    // Side Bar Toggle
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return(
        <>
            <HeaderAdmin
                setSidebarOpen={setSidebarOpen}
            />
            <main className="relative flex max-w-[1040px] min-h-screen mx-auto">
                <AdminSidebar
                    sideBarOpen={sidebarOpen}
                    setSideBarOpen={setSidebarOpen}
                />
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}

export default AdminApp;