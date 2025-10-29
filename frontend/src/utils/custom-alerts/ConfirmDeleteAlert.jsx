import {TbAlertTriangleFilled} from "react-icons/tb";
import {PulseLoader} from "react-spinners";

function ConfirmDeleteAlert({handleCancel, handleDelete, deleteLoading}){
    return(
        <div className="fixed top-0 left-0 h-screen w-screen bg-black/50 overflow-hidden flex items-center justify-center z-[11]">
            <div className="sm:w-[400px] bg-white rounded p-6 flex flex-col gap-7">
                {/*  Warning Icon, Type  */}
                <div className="flex items-center gap-4">
                    {/*  Icon  */}
                    <TbAlertTriangleFilled className="text-6xl text-red-600"/>

                    {/*  Titles  */}
                    <div>
                        <h3 className="uppercase text-[22px] font-semibold text-gray-700">Delete</h3>
                        <p className="text-gray-600 font-light text-lg">Are you sure you want to delete?</p>
                    </div>
                </div>

                {/*  Divider  */}
                <div className="h-[2px] w-full bg-gray-300"></div>

                {/*  Buttons  */}
                <div className="flex items-center justify-end gap-4">
                    {/*  Cancel  */}
                    <button onClick={handleCancel} className="border border-gray-600 rounded px-2 py-2 font-semibold w-[120px] cursor-pointer">Cancel</button>

                    {/*  Delete  */}
                    <button onClick={()=>handleDelete()} className="border border-red-600 rounded px-2 py-2 font-semibold w-[120px] bg-red-600 text-white cursor-pointer">{deleteLoading ? <PulseLoader size={6} color={"#fff"}/> : "Delete"}</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDeleteAlert;