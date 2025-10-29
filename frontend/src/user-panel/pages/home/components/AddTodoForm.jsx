import {IoMdArrowDropdown, IoMdClose} from "react-icons/io";
import {useDispatch, useSelector} from "react-redux";
import {getTodoFormErrors, handleCloseAddTodoForm} from "../../../../redux/features/user-panel/todo/todoSlice.js";
import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {useResponseHandler} from "../../../../utils/useResponseHandler.jsx";
import {handleToggleAppLoading} from "../../../../redux/features/app/appFunction/appSlice.js";
import {useCreateTodoMutation, useUpdateTodoMutation} from "../../../../redux/features/user-panel/todo/todoApi.js";
import {addTodoFormSchema} from "../../../../utils/zodValidation.js";
import {PulseLoader} from "react-spinners";

function AddTodoForm(){

    // Redux
    const dispatch = useDispatch();
    const todoFormEditMode = useSelector((state)=>state.todoFeature.todoFormEditMode)
    const todoFormErrors = useSelector((state)=>state.todoFeature.todoFormErrors)
    const selectedTodoForEdit = useSelector((state)=>state.todoFeature.selectedTodoForEdit)

    // Priority & Status Selector
    const [prioritySelectorOpen, setPrioritySelectorOpen] = useState(false);
    const [statusSelectorOpen, setStatusSelectorOpen] = useState(false);

    // Response Handler
    const {successResponse, errorResponse} = useResponseHandler()

    // Form States
    const [todoId, setTodoId] = useState("")
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState("")
    useEffect(()=>{
        if(selectedTodoForEdit?._id){
            setTodoId(selectedTodoForEdit._id.toString())
            setTitle(selectedTodoForEdit?.title)
            setDescription(selectedTodoForEdit?.description)
            setPriority(selectedTodoForEdit?.priority)
            setStatus(selectedTodoForEdit?.status)
            setDueDate(selectedTodoForEdit?.dueDate)
        }
    }, [selectedTodoForEdit])

    // Call Create Todos API
    const [createTodo, {isLoading: createTodoLoading}] = useCreateTodoMutation()

    // Call Update Todos API
    const [updateTodo, {isLoading: updateTodoLoading}] = useUpdateTodoMutation()


    // Handle Submit Add Todos Form
    const handleSubmitAddTodoForm = async (e)=>{
        // Stop Reload On Submit
        e.preventDefault();

        // Reset Errors
        dispatch(getTodoFormErrors({
            field: "title",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "description",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "priority",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "status",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "dueDate",
            errorMessage: ""
        }))

        try{
            // Get Todos Data
            const data = {
                title,
                description,
                priority,
                dueDate: dueDate.toString(),
                status,
            }

            // Validate Fields
            if(data.title === "" || data.priority === "" || data.status === "" || data.dueDate === ""){
                // Title
                if(data.title === ""){
                    dispatch(getTodoFormErrors({
                        field: "title",
                        errorMessage: "Enter a title for the todo."
                    }))
                }

                // Priority
                if(data.priority === ""){
                    dispatch(getTodoFormErrors({
                        field: "priority",
                        errorMessage: "Select a priority for the todo."
                    }))
                }

                // Status
                if(data.status === ""){
                    dispatch(getTodoFormErrors({
                        field: "status",
                        errorMessage: "Select a status for the todo."
                    }))
                }

                // Due Date
                if(data.dueDate === ""){
                    dispatch(getTodoFormErrors({
                        field: "dueDate",
                        errorMessage: "Select a due date for the todo."
                    }))
                }

                return
            }

            // Zod Validation
            const validation = addTodoFormSchema.safeParse(data);

            // If Validation Error
            if(!validation.success){
                // Get Zod Error
                const zodError = validation.error

                // All Errors
                let allErrors = []
                if(zodError.issues && Array.isArray(zodError.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        field: issue.path[0],
                        message: issue.message,
                    }))
                }

                // Show Error
                allErrors.forEach((error)=>{
                    dispatch(getTodoFormErrors({
                        field: error.field,
                        errorMessage: error.message
                    }))
                })

                return
            }

            // Get Data From Validation
            const todoData = validation.data

            // Hit Create Todos API
            const response = await createTodo(todoData).unwrap()

            // Clear All States
            setTodoId("")
            setTitle("")
            setDescription("")
            setPriority("")
            setStatus("")
            setDueDate("")

            // Form Close
            dispatch(handleCloseAddTodoForm())

            return successResponse(response)
        }catch(error){
            return errorResponse(error);
        }
    }

    // Handle Submit Update Todos Form
    const handleSubmitUpdateTodoForm = async (e)=>{
        // Stop Reload On Submit
        e.preventDefault();

        // Reset Errors
        dispatch(getTodoFormErrors({
            field: "title",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "description",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "priority",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "status",
            errorMessage: ""
        }))
        dispatch(getTodoFormErrors({
            field: "dueDate",
            errorMessage: ""
        }))

        try{
            // Get Todos Data
            const data = {
                title,
                description,
                priority,
                dueDate: dueDate.toString(),
                status,
            }

            // Validate Fields
            if(data.title === "" || data.priority === "" || data.status === "" || data.dueDate === ""){
                // Title
                if(data.title === ""){
                    dispatch(getTodoFormErrors({
                        field: "title",
                        errorMessage: "Enter a title for the todo."
                    }))
                }

                // Priority
                if(data.priority === ""){
                    dispatch(getTodoFormErrors({
                        field: "priority",
                        errorMessage: "Select a priority for the todo."
                    }))
                }

                // Status
                if(data.status === ""){
                    dispatch(getTodoFormErrors({
                        field: "status",
                        errorMessage: "Select a status for the todo."
                    }))
                }

                // Due Date
                if(data.dueDate === ""){
                    dispatch(getTodoFormErrors({
                        field: "dueDate",
                        errorMessage: "Select a due date for the todo."
                    }))
                }

                return
            }

            // Zod Validation
            const validation = addTodoFormSchema.safeParse(data);

            // If Validation Error
            if(!validation.success){
                // Get Zod Error
                const zodError = validation.error

                // All Errors
                let allErrors = []
                if(zodError.issues && Array.isArray(zodError.issues)){
                    allErrors = zodError.issues.map((issue)=>({
                        field: issue.path[0],
                        message: issue.message,
                    }))
                }

                // Show Error
                allErrors.forEach((error)=>{
                    dispatch(getTodoFormErrors({
                        field: error.field,
                        errorMessage: error.message
                    }))
                })

                return
            }

            // Get Data From Validation
            const todoData = validation.data

            // Get Edit Todos Data
            const editTodoData = {
                _id: todoId,
                ...todoData
            }

            // Hit Update Todos API
            const response = await updateTodo(editTodoData).unwrap()

            // Clear All States
            setTodoId("")
            setTitle("")
            setDescription("")
            setPriority("")
            setStatus("")
            setDueDate("")

            // Form Close
            dispatch(handleCloseAddTodoForm())

            return successResponse(response)
        }catch(error){
            return errorResponse(error);
        }
    }

    return(
        <div className="fixed top-0 left-0 bg-white/20 h-screen w-screen flex items-center justify-center">
            <form onSubmit={(e)=>todoFormEditMode && selectedTodoForEdit?._id ? handleSubmitUpdateTodoForm(e) : handleSubmitAddTodoForm(e)} className="bg-[#1F2938] w-[calc(100vw-50px)] max-w-[480px] p-8">
                {/*  Title & Close Button  */}
                <div className="text-white flex items-center justify-between">
                    {/*  Form Title  */}
                    <h4 className="text-[22px] font-semibold">{todoFormEditMode ? "Edit Todo" : "Add Todo"}</h4>

                    {/*  Close Form  */}
                    <IoMdClose onClick={()=>dispatch(handleCloseAddTodoForm())} className="text-2xl cursor-pointer"/>
                </div>

                {/*  Input Fields  */}
                <div className="flex flex-col gap-[14px] mt-6">
                    {/*  Title  */}
                    <div>
                        <label htmlFor="title" className="text-white/50 text-sm">Title</label>
                        <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full p-3 bg-white/10 rounded outline-none border border-white/10 text-white" id="title"/>
                        {todoFormErrors.titleError !== "" && <p className="text-red-500 text-sm mt-[2px]">{todoFormErrors.titleError}</p>}
                    </div>

                    {/*  description  */}
                    <div>
                        <label htmlFor="description" className="text-white/50 text-sm">Description</label>
                        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="w-full h-[100px] p-[10px] bg-white/10 rounded outline-none border border-white/10 text-white" id="description"></textarea>
                        {todoFormErrors.descriptionError !== "" && <p className="text-red-500 text-sm">{todoFormErrors.descriptionError}</p>}
                    </div>

                    {/*  Priority  */}
                    <div className="relative -mt-[6px]">
                        <label className="text-white/50 text-sm">Priority</label>

                        {/*  Selected Priority  */}
                        <div onClick={()=>setPrioritySelectorOpen((opened)=>!opened)} className="w-full p-[10px] bg-white/10 rounded border border-white/10 text-white cursor-pointer flex items-center justify-between gap-4">
                            <h4 className="capitalize">{priority === "" ? <span className="text-white/60">Select priority</span> : priority}</h4>
                            {prioritySelectorOpen ? <IoMdClose /> : <IoMdArrowDropdown className="text-lg"/>}
                        </div>

                        {/*  Error  */}
                        {todoFormErrors.priorityError !== "" && <p className="text-red-500 text-sm mt-[2px]">{todoFormErrors.priorityError}</p>}

                        {/*  Priority Selector  */}
                        {prioritySelectorOpen && <div className="absolute top-[calc(100%+1px)] left-0 w-full bg-[#121212] opacity-100 divide-y divide-white/20 z-[10]">
                            <button onClick={()=> {
                                setPriority("low")
                                setPrioritySelectorOpen(false);
                            }} className="text-white/70 hover:text-white/90 bg-white/20 w-full text-start p-3 text-sm cursor-pointer">Low
                            </button>
                            <button onClick={()=> {
                                setPriority("medium")
                                setPrioritySelectorOpen(false);
                            }} className="text-white/70 hover:text-white/90 bg-white/20 w-full text-start p-3 text-sm cursor-pointer">Medium
                            </button>
                            <button onClick={()=> {
                                setPriority("high")
                                setPrioritySelectorOpen(false);
                            }} className="text-white/70 hover:text-white/90 bg-white/20 w-full text-start p-3 text-sm cursor-pointer">High
                            </button>
                        </div>}
                    </div>

                    {/*  Status  */}
                    <div className="relative">
                        <label className="text-white/50 text-sm">Status</label>

                        {/*  Selected Status  */}
                        <div onClick={()=>setStatusSelectorOpen((opened)=>!opened)} className="w-full p-[10px] bg-white/10 rounded border border-white/10 text-white cursor-pointer flex items-center justify-between gap-4">
                            <h4 className="capitalize">{status === "" ? <span className="text-white/60">Select status</span> : status}</h4>
                            {statusSelectorOpen ? <IoMdClose /> : <IoMdArrowDropdown className="text-lg"/>}
                        </div>

                        {/*  Error  */}
                        {todoFormErrors.statusError !== "" && <p className="text-red-500 text-sm mt-[2px]">{todoFormErrors.statusError}</p>}

                        {/*  Priority Selector  */}
                        {statusSelectorOpen && <div className="absolute top-[calc(100%+1px)] left-0 w-full bg-[#121212] opacity-100 divide-y divide-white/20 z-[9]">
                            <button onClick={()=> {
                                setStatus("pending")
                                setStatusSelectorOpen(false);
                            }} className="text-white/70 hover:text-white/90 bg-white/20 w-full text-start p-3 text-sm cursor-pointer">Pending</button>
                            <button onClick={()=> {
                                setStatus("completed")
                                setStatusSelectorOpen(false);
                            }} className="text-white/70 hover:text-white/90 bg-white/20 w-full text-start p-3 text-sm cursor-pointer">Completed</button>
                        </div>}
                    </div>

                    {/*  Due Date  */}
                    <div className="relative flex flex-col">
                        <label className="text-white/50 text-sm">Due Date</label>
                        <DatePicker
                            selected={dueDate}
                            onChange={(date)=>setDueDate(date)}
                            className="w-full p-3 mt-1 bg-white/10 rounded border border-white/10 text-white outline-none placeholder-white/60"
                            placeholderText="Select due date"
                            dateFormat="dd-MM-yyyy"
                        />
                        {todoFormErrors.dueDateError !== "" && <p className="text-red-500 text-sm mt-[2px]">{todoFormErrors.dueDateError}</p>}
                    </div>

                    {/*  Submit Button  */}
                    <button type="submit" className="text-white p-[10px] rounded cursor-pointer font-semibold border border-white/30 bg-black mt-3">
                        {
                            createTodoLoading || updateTodoLoading ? <PulseLoader size={6} color={"#fff"}/> : todoFormEditMode ? "Update Todo" : "Add Todo"
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddTodoForm;