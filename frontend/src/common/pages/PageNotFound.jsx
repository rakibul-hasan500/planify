import {Link} from "react-router";
import {FaLongArrowAltRight} from "react-icons/fa";

function PageNotFound(){
    return(
        <div className="flex flex-col items-center justify-center text-center h-screen w-screen bg-black overflow-hidden">
            {/*  Status Code  */}
            <h1 className="relative sm:leading-50 text-[96px] sm:text-[190px] font-[800] text-[tomato] z-[1] before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:h-full before:w-full before:text-white before:z-[2] before:translate-[2px] sm:before:translate-1" data-text="404">404</h1>

            {/*  Page Not Found Text  */}
            <p className="relative text-[24px] sm:text-[38px] font-[800] text-white" data-text="PAGE NOT FOUND!">PAGE NOT FOUND!</p>

            {/*  Home Button  */}
            <Link to="/" replace className="relative flex items-center gap-2 rounded px-4 py-2 text-gray-700 bg-white font-semibold mt-6">
                <span className="text-sm sm:text-base">HOME PAGE</span>
                <FaLongArrowAltRight />
            </Link>
        </div>
    )
}


export default PageNotFound;