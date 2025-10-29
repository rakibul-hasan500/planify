import {NavLink} from "react-router";
import {IoMdClose} from "react-icons/io";

function AdminSidebar({sideBarOpen, setSideBarOpen}){
    return(
        <div className={`fixed top-0 md:left-0 md:relative  bg-white  sm:block h-full min-w-[300px] p-4 border border-gray-200 transition-all duration-200 z-[10] ${sideBarOpen ? "left-0" : "-left-[300px]"}`}>
            {/*  Sidebar Top  */}
            <div className="md:hidden flex items-center justify-between gap-4 mb-6">
                <h5 className="font-semibold text-gray-700">MENU</h5>
                <IoMdClose onClick={()=>setSideBarOpen(false)} className="text-2xl bg-gray-200 cursor-pointer text-red-500"/>
            </div>

            {/*  Nav Items  */}
            <ul className="flex flex-col gap-1">
                <NavLink to="/admin" end onClick={()=>setSideBarOpen(false)} className={({isActive})=>`${isActive ? "bg-gray-200 text-gray-700 font-semibold" : "text-gray-400"} px-2 py-2 text-[15px]`}>Setting</NavLink>
                <NavLink to="/admin/users" onClick={()=>setSideBarOpen(false)} className={({isActive})=>`${isActive ? "bg-gray-200 text-gray-700 font-semibold" : "text-gray-400"} px-2 py-2 text-[15px]`}>Users</NavLink>
            </ul>
        </div>
    )
}

export default AdminSidebar;