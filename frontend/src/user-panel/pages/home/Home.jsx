import {useState} from "react";
import {IoIosAddCircleOutline, IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import "./style/style.css"
import {FaRegCalendar, FaRegClock} from "react-icons/fa";
import {IoCheckmarkDoneCircleOutline} from "react-icons/io5";
import TodoCard from "./components/TodoCard.jsx";
import AddTodoForm from "./components/AddTodoForm.jsx";
import {useDispatch, useSelector} from "react-redux";
import {handleOpenAddTodoForm} from "../../../redux/features/user-panel/todo/todoSlice.js";
import {useGetTodosQuery} from "../../../redux/features/user-panel/todo/todoApi.js";
import {PulseLoader} from "react-spinners";
import {MdArrowDropDown} from "react-icons/md";
import SiteTitleUpdator from "../../../utils/SiteTitleUpdator.jsx";

function Home(){

    // Redus
    const dispatch = useDispatch();
    const addTodoFormOpen = useSelector((state)=>state.todoFeature.addTodoFormOpen)

    // Filter State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState("")

    // Handle Go Next Page
    const handleGoPrevPage = ()=>{
        if(page >= 2){
            setPage(page-1)
        }
    }

    // Call Get Todos API
    const {data: getTodosData, isLoading: getTodosLoading} = useGetTodosQuery({status, page, limit})

    // Handle Go Next Page
    const totalFiltered = getTodosData?.data?.counts?.filtered || 0
    const pageExist = Math.ceil(totalFiltered / limit) || 1
    const handleGoNextPage = ()=>{
        if(page < pageExist){
            setPage(page+1)
        }
    }

    return(
        <div className="min-h-[calc(100vh-72px)] w-full bg-[#121212] pb-10">
            {/*  Change Page Title  */}
            <SiteTitleUpdator />

            {/*  Tasks Title & Add Button  */}
            <div className="flex items-center justify-between gap-6 max-w-[1040px] mx-auto pt-10 px-4">
                {/*  Task Title  */}
                <h4 className="text-3xl font-bold text-white">My Tasks</h4>

                {/*  Add Task Button  */}
                <button onClick={()=>dispatch(handleOpenAddTodoForm())} className="bg-white/20 px-4 py-[10px] rounded-lg text-white font-semibold text-sm flex items-center gap-1 cursor-pointer">
                    <IoIosAddCircleOutline className="text-xl"/>
                    <span>Add Task</span>
                </button>
            </div>

            {/*  Tasks Status Box  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center justify-between gap-5 sm:gap-8 max-w-[1040px] mx-auto pt-10 px-4">
                {/*  Due Today  */}
                <div className="bg-[#1F2938] p-6 flex items-center gap-2 text-white font-semibold w-full">
                    <FaRegCalendar className="text-yellow-600 text-lg"/>
                    <p>Due Today ({getTodosData?.data?.counts?.dueToday || "0"})</p>
                </div>

                {/*  High Priority  */}
                <div className="bg-[#1F2938] p-6 flex items-center gap-2 text-white font-semibold">
                    <FaRegClock className="text-red-600 text-lg"/>
                    <p>High Priority ({getTodosData?.data?.counts?.highPriority || "0"})</p>
                </div>

                {/*  Pending  */}
                <div className="bg-[#1F2938] p-6 flex items-center gap-2 text-white font-semibold">
                    <FaRegClock className="text-white/40 text-lg"/>
                    <p>Pending ({getTodosData?.data?.counts?.pending || "0"})</p>
                </div>

                {/*  Completed  */}
                <div className="bg-[#1F2938] p-6 flex items-center gap-2 text-white font-semibold">
                    <IoCheckmarkDoneCircleOutline className="text-green-600 text-xl"/>
                    <p>Completed ({getTodosData?.data?.counts?.completed || "0"})</p>
                </div>
            </div>

            {/*  Filter Tab Buttons  */}
            <div className="max-w-[1040px] mx-auto pt-10 px-4 flex items-center justify-between gap-4">
                {/*  Filter Tab Buttons  */}
                <div className="flex items-center gap-3 ">
                    {/*  All  */}
                    <button onClick={()=>{
                        setPage(1)
                        setStatus("")
                    }} className={`${status === "" ? "bg-white/20 text-white" : "bg-white/10 text-white/50"} text-sm font-semibold px-4 py-3 rounded cursor-pointer`}>All ({getTodosData?.data?.counts?.all || "0"})</button>

                    {/*  Pending  */}
                    <button onClick={()=>{
                        setPage(1)
                        setStatus("pending")
                    }} className={`${status === "pending" ? "bg-white/20 text-white" : "bg-white/10 text-white/50"} text-sm font-semibold px-4 py-3 rounded cursor-pointer`}>Pending</button>

                    {/*  All  */}
                    <button onClick={()=>{
                        setPage(1)
                        setStatus("completed")
                    }} className={`${status === "completed" ? "bg-white/20 text-white" : "bg-white/10 text-white/50"} text-sm font-semibold px-4 py-3 rounded cursor-pointer`}>Completed</button>
                </div>

                {/*  Limit  */}
                <div className="relative group">
                    {/*  Selected Limit  */}
                    <div className="w-[80px] bg-white/20 py-2 px-4 text-white flex items-center justify-between border border-white/30 rounded-lg cursor-pointer font-semibold">
                        <h6 className="">{limit || "0"}</h6>
                        <MdArrowDropDown className="text-xl -mr-1"/>
                    </div>

                    {/*  Limit Selector  */}
                    <div className="hidden group-hover:flex flex-col text-white/40 text-sm bg-black border border-white/20 divide-y divide-white/10 absolute w-full">
                        <button onClick={()=>setLimit(10)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">10</button>
                        <button onClick={()=>setLimit(20)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">20</button>
                        <button onClick={()=>setLimit(30)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">30</button>
                        <button onClick={()=>setLimit(getTodosData?.data?.counts?.all || 0)} className="p-[6px] w-full bg-white/10 hover:bg-white/20 cursor-pointer">All</button>
                    </div>
                </div>
            </div>

            {/*  Todos Loading  */}
            {getTodosLoading && <div className="flex items-center justify-center mt-14 max-w-[1040px] mx-auto pt-10 px-4">
                <PulseLoader size={6} color={"#fff"}/>
            </div>}

            {/*  Todos  */}
            <div className="flex flex-col items-center gap-4 max-w-[1040px] mx-auto pt-5 px-4">
                {
                    getTodosData?.data?.todos?.length > 0 && getTodosData?.data?.todos?.map((todo, index)=>(
                        <TodoCard key={index} todo={todo}/>
                    ))
                }
            </div>

            {/*  Add Todos Form  */}
            {addTodoFormOpen && <AddTodoForm/>}

            {/*  Pagination  */}
            <div className="flex items-center justify-between gap-2 max-w-[1040px] mx-auto pt-5 px-4">
                {/*  Total Item Shows  */}
                <div className="text-white/80">
                    {(()=>{
                        const itemCount = getTodosData?.data?.counts?.filtered || 0
                        const start = itemCount > 0 ? (page - 1) * limit + 1 : 0
                        const end = Math.min(page * limit, itemCount)

                        return <p className="text-[15px] font-light">Showing {start}-{end} of {itemCount} items</p>
                    })()}
                </div>

                {/*  Pagination Button  */}
                <div className="flex items-center justify-between min-w-[120px]">
                    <button onClick={handleGoPrevPage} className={`${page < 2 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-white bg-white/20 w-9 h-9 flex items-center justify-center text-2xl`}><IoIosArrowBack /></button>
                    <p className="text-white">{page}</p>
                    <button onClick={handleGoNextPage} className={`${page === pageExist ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} text-white bg-white/20 w-9 h-9 flex items-center justify-center text-2xl cursor-pointer`}><IoIosArrowForward /></button>
                </div>
            </div>
        </div>
    )
}

export default Home;