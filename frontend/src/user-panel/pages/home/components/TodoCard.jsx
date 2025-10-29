import {IoCheckmarkDoneCircleOutline} from "react-icons/io5";
import {FaRegClock} from "react-icons/fa";
import {MdOutlineModeEditOutline} from "react-icons/md";
import {RiDeleteBin6Line} from "react-icons/ri";
import {
    useDeleteTodoMutation,
    useUpdateTodoStatusMutation
} from "../../../../redux/features/user-panel/todo/todoApi.js";
import {useResponseHandler} from "../../../../utils/useResponseHandler.jsx";
import {useDispatch} from "react-redux";
import {handleOpenEditTodoForm} from "../../../../redux/features/user-panel/todo/todoSlice.js";
import {ClipLoader} from "react-spinners";

function TodoCard({todo}){

    // Redus
    const dispatch = useDispatch();

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Call Delete Todos API
    const [deleteTodo, {isLoading: deleteTodoLoading}] = useDeleteTodoMutation()

    // Handle Delete Todos
    const handleDeleteTodo = async (id)=>{
        try{
            // Hit elete Todos API
            const response = await deleteTodo(id.toString()).unwrap()

            return successResponse(response)
        }catch(error){
            return errorResponse(error)
        }
    }

    // Call Update Todos Status API
    const [updateTodoStatus, {isLoading: updateTodoStatusLoading}] = useUpdateTodoStatusMutation()

    // Handle Update Todos Status
    const handleUpdateTodoStatus = async (id)=>{
        try{
            // Hit Update Todos Status API
            await updateTodoStatus(id).unwrap()

            return;
        }catch(error){
            return errorResponse(error)
        }
    }

    return(
        <div className="w-full p-4 bg-[#1F2938] rounded flex gap-2 items-start">
            {/*  Complete Button  */}
            <div>
                {
                    updateTodoStatusLoading ?
                        <ClipLoader size={24} color={"#fff"}/> :
                        <button onClick={()=>handleUpdateTodoStatus(todo._id.toString())} className={`${todo.status === "completed" ? "text-green-600" : "text-gray-400"} cursor-pointer`}>
                            <IoCheckmarkDoneCircleOutline className="text-2xl"/>
                        </button>
                }
            </div>

            {/*  Todos Details  */}
            <div className="w-full">
                {/*  Title  */}
                <h2 className={`${todo.status === "completed" && "line-through"} text-white text-[17px]`}>{todo.title || ""}</h2>

                {/*  Description  */}
                {todo.description !== "" && <p className="text-gray-400 font-light text-[15px] mt-1">{todo.description || ""}</p>}

                {/*  Priority, Date && Edit, Delete  */}
                <div className="flex items-center justify-between gap-6">
                    {/*  Priority, Date  */}
                    <div className="flex items-center gap-4 text-[13px] mt-4">
                        <span className={`${todo.priority === "high" ? "text-red-500" : todo.priority === "medium" ? "text-yellow-600" : "text-green-500"} capitalize`}>{todo.priority || ""}</span>
                        {(()=>{
                            const currentDate = new Date();
                            currentDate.setHours(0, 0, 0, 0)
                            const dueDateObj = new Date(todo.dueDate)
                            dueDateObj.setHours(0, 0, 0, 0)

                            const dueDateString = dueDateObj.toLocaleDateString("en-us", {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })
                            return <span className={`${dueDateObj <= currentDate ? "text-red-500" : "text-white/70"} flex items-center gap-1`}><FaRegClock />{dueDateString}</span>
                        })()}
                    </div>

                    {/*  Edit & Delete  */}
                    <div className="flex gap-4 items-center text-white mt-2 sm:hidden">
                        <MdOutlineModeEditOutline onClick={()=>dispatch(handleOpenEditTodoForm(todo))} className="cursor-pointer"/>
                        {deleteTodoLoading ? <ClipLoader size={18} color={"#fff"}/> : <RiDeleteBin6Line onClick={() => handleDeleteTodo(todo._id)} className="cursor-pointer"/>}
                    </div>
                </div>
            </div>

            {/*  Edit & Delete  */}
            <div className="hidden sm:flex gap-4 items-center text-white mt-2">
                <MdOutlineModeEditOutline onClick={()=>dispatch(handleOpenEditTodoForm(todo))} className="cursor-pointer"/>
                {deleteTodoLoading ? <ClipLoader size={18} color={"#fff"}/> : <RiDeleteBin6Line onClick={() => handleDeleteTodo(todo._id)} className="cursor-pointer"/>}
            </div>
        </div>
    )
}

export default TodoCard;