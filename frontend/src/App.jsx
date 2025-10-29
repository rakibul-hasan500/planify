import './App.css'
import {Outlet} from "react-router";
import {useSelector} from "react-redux";
import Header from "./user-panel/components/Header.jsx";
import Footer from "./user-panel/components/Footer.jsx";

function App() {

    // Get App Loading State - Redux
    const appLoading = useSelector((state)=>state.appFeature.appLoading);

    return (
        <>
            <Header/>
            <main className={`${appLoading ? "pointer-events-none cursor-wait" : ""}`}>
                <Outlet/>
            </main>
            <Footer/>
        </>
    )
}

export default App
