import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import {useRef} from "react";
import Navigation from "./component/Navigation";

export default function App() {
    const sidebar_ref = useRef(null);

    return (
        <>
            <Header ref={sidebar_ref} />
            <div className="flex flex-row h-full w-full text-white">
                <Sidebar ref={sidebar_ref} />
                <Navigation />
            </div>
        </>
    );
}
