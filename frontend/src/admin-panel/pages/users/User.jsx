import UserCard from "./components/UserCard.jsx";
import {useDeleteUserMutation, useGetAllUsersQuery} from "../../../redux/features/admin-panel/user/userApi.js";
import {CiFilter} from "react-icons/ci";
import {useState} from "react";
import {useResponseHandler} from "../../../utils/useResponseHandler.jsx";
import ConfirmDeleteAlert from "../../../utils/custom-alerts/ConfirmDeleteAlert.jsx";
import {MdArrowDropDown} from "react-icons/md";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function User(){

    // Search User State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [search, setSearch] = useState("");

    // Delete States
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Call Get All Users API
    const {data: allUsersData} = useGetAllUsersQuery({
        page,
        limit,
        search,
    })

    // Call Delete User API
    const [deleteUser, {isLoading: deleteUserLoading}] = useDeleteUserMutation()

    // Handle Delete User
    const handleDeleteUser = async ()=>{
        try{
            // Hit Delete User API
            const response = await deleteUser(selectedIdForDelete)

            // Close Dialog
            setSelectedIdForDelete("")
            setDeleteDialogOpen(false)

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    // Handle Cancle Delete
    const handleCancelDeleteUser = ()=>{
        setSelectedIdForDelete("")
        setDeleteDialogOpen(false)
    }

    // Handle Go Prev Page
    const handleGoPrevPage = ()=>{
        if(page >= 2){
            setPage(page - 1)
        }
    }

    // Handle Go Next Page
    const pageExist = Math.ceil(allUsersData?.data?.allUsersCount / limit)
    const handleGoNextPage = ()=>{
        if(page < pageExist){
            setPage(page + 1)
        }
    }

    return(
        <div className="relative w-full p-4">
            {/*  Change Page Title  */}
            <SiteTitleUpdator page={"Admin - Users | "}/>

            {/*  Title  */}
            <h5 className="text-lg font-semibold text-black">Users <span className="text-sm font-light">({allUsersData?.data?.allUsersCount || 0})</span></h5>

            {/*  Users Header  */}
            <div className="mt-9">
                {/*  Search & Limit  */}
                <div className="flex items-center justify-between">
                    {/*  Search  */}
                    <input placeholder="Search" type="text" value={search} onChange={(e)=>setSearch(e.target.value)} className="px-2 py-[6px] rounded outline-none border border-gray-400"/>

                    {/*  Limit  */}
                    <div className="relative group">
                        {/*  Selected Limit  */}
                        <div className="w-[80px] bg-black py-2 px-4 text-sm text-white flex items-center justify-between border border-white/30 rounded cursor-pointer font-semibold">
                            <h6 className="">{limit || "0"}</h6>
                            <MdArrowDropDown className="text-xl -mr-1"/>
                        </div>

                        {/*  Limit Selector  */}
                        <div className="hidden group-hover:flex flex-col text-white/60 text-xs bg-black border border-white/20 divide-y divide-white/20 absolute w-full">
                            <button onClick={()=>setLimit(10)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">10</button>
                            <button onClick={()=>setLimit(20)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">20</button>
                            <button onClick={()=>setLimit(30)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">30</button>
                            <button onClick={()=>setLimit(allUsersData?.data?.allUsersCount || 0)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">All</button>
                        </div>
                    </div>
                </div>

                {/*  Header  */}
                <div className="grid sm:grid-cols-12 mt-3 gap-2 items-center bg-[#1F2938] px-2 py-[10px] sm:divide-x-1 md:divide-x-0 lg:divide-x-1 divide-gray-400">
                    {/*  User Name, Email, Role  */}
                    <div className="sm:col-span-6 md:col-span-10 lg:col-span-6">
                        <h5 className="font-bold text-white text-sm">User</h5>
                    </div>

                    {/*  Status  */}
                    <div className="hidden sm:block sm:col-span-2 md:hidden lg:block text-center">
                        <h5 className="font-bold text-white text-sm">Verified</h5>
                    </div>

                    {/*  Provider  */}
                    <div className="hidden sm:block sm:col-span-2 md:hidden lg:block text-center">
                        <h5 className="font-bold text-white text-sm">Provider</h5>
                    </div>

                    {/*  Edit / Delete  */}
                    <div className="hidden sm:block sm:col-span-2 md:hidden lg:block text-center">
                        <h5 className="font-bold text-white text-sm">Edit/Delete</h5>
                    </div>
                </div>
            </div>

            {/*  Users Card  */}
            <div>
                {
                    allUsersData?.data?.users?.map((user, index)=>(
                        <UserCard
                            key={index}
                            user={user}
                            setSelectedIdForDelete={setSelectedIdForDelete}
                            setDeleteDialogOpen={setDeleteDialogOpen}
                        />
                    ))
                }
            </div>

            {/*  Delete User Alert  */}
            {deleteDialogOpen && <ConfirmDeleteAlert
                handleCancel={handleCancelDeleteUser}
                handleDelete={handleDeleteUser}
                deleteLoading={deleteUserLoading}
            />}

            {/*  Pagination  */}
            <div className="flex items-center justify-end gap-2 max-w-[1040px] mx-auto pt-5 px-4">
                {/*  Pagination Button  */}
                <div className="flex items-center justify-between min-w-[120px]">
                    <button onClick={handleGoPrevPage} className={`${page < 2 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-white bg-black w-9 h-9 flex items-center justify-center text-2xl`}><IoIosArrowBack /></button>
                    <p className="text-black">{page}</p>
                    <button onClick={handleGoNextPage} className={`${page === pageExist ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-white bg-black w-9 h-9 flex items-center justify-center text-2xl cursor-pointer`}><IoIosArrowForward /></button>
                </div>
            </div>
        </div>
    )
}

export default User;