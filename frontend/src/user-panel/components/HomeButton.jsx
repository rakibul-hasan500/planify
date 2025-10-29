import {IoHome} from "react-icons/io5";
import {Link} from "react-router";

function HomeButton(){
    return(
        <Link to="/" className="fixed top-6 left-6 bg-white h-12 w-12 flex items-center justify-center border border-gray-300 rounded">
            <IoHome className="text-xl"/>
        </Link>
    )
}

export default HomeButton;