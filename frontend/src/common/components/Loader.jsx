import {PulseLoader} from "react-spinners";

function Loader(){
    return(
        <div className="h-screen w-screen flex items-center justify-center">
            <PulseLoader size={10} margin={5}/>
        </div>
    )
}

export default Loader;