import {RiDeleteBin6Line} from "react-icons/ri";
import {useSelector} from "react-redux";

function UserCard({user, setSelectedIdForDelete, setDeleteDialogOpen}){

    // Redux
    const userData = useSelector((state) => state.appFeature.userData)

    return(
        <div className="grid sm:grid-cols-12 gap-2 items-center px-2 py-3 border-b border-gray-400">
            {/*  User Name, Email, Role  */}
            <div className="sm:col-span-6 md:col-span-10 lg:col-span-6 flex items-start gap-[6px]">
                {/*  Dot  */}
                <div className="w-[9px] h-[9px] rounded-full mt-[7px] bg-gray-900"></div>

                {/*  Details  */}
                <div>
                    {/*  Name & Email  */}
                    <p className="text-gray-700 font-semibold">{user?.name} <span className={`${user?.role === "admin" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"} text-[10px] py-2 px-2 rounded uppercase`}>{user?.role}</span></p>
                    <p className="text-gray-600 font-light text-sm mt-1">{user?.email}</p>

                    {/*  Verified, Provider, Edit & Delete  */}
                    <div className="flex sm:hidden md:flex lg:hidden text-[13px] text-gray-500 font-light flex-wrap items-center gap-4 mt-2">
                        <p>Verified: <span className={`${user?.isVerified === true ? "text-green-600" : "text-red-600"} text-gray-600 font-semibold`}>{user?.isVerified === true ? "True" : "False"}</span></p>
                        <p>Provider: <span className={`${user?.authProvider === "email" ? "text-red-600" : "text-yellow-600"} text-gray-600 font-semibold capitalize`}>{user?.authProvider}</span></p>
                        <button onClick={()=> {
                            setSelectedIdForDelete(user._id.toString())
                            setDeleteDialogOpen(true)
                        }} className="text-red-600 cursor-pointer font-semibold flex items-center gap-1 bg-red-100 px-2 py-1 rounded">
                            <RiDeleteBin6Line/>
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/*  Status  */}
            <div className="hidden sm:block sm:col-span-2 md:hidden lg:block text-center">
                <h5 className={`${user?.isVerified === true ? "text-green-600" : "text-red-600"} font-semibold text-sm`}>{user?.isVerified === true ? "True" : "False"}</h5>
            </div>

            {/*  Provider  */}
            <div className="hidden sm:block sm:col-span-2 md:hidden lg:block text-center">
                <h5 className={`${user?.authProvider === "email" ? "text-red-600" : "text-yellow-600"} font-semibold text-sm capitalize`}>{user?.authProvider}</h5>
            </div>

            {/*  My Account & Edit/Delete  */}
            <div className="hidden sm:flex sm:col-span-2 md:hidden lg:flex text-center items-center justify-center gap-3">
                {/*  My Account  */}
                {user?.email === userData?.email && <p className="bg-green-100 text-green-600 py-1 px-3 rounded-full text-xs font-semibold">ME</p>}

                {/*  Edit & Delete  */}
                {user?.email !== userData?.email && <button className="cursor-pointer text-red-600 flex items-center gap-1 text-sm px-2 py-1 rounded bg-red-100" onClick={()=> {
                    setSelectedIdForDelete(user._id.toString())
                    setDeleteDialogOpen(true)
                }}>
                    <RiDeleteBin6Line/>
                    Delete
                </button>}
            </div>
        </div>
    )
}

export default UserCard;