import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import { useState } from "react";
import Navigation from "./component/Navigation";

export default function App() {
    const [activeSidebar, setActiveSidebar] = useState(true);
    const onToggleSidebar = () => setActiveSidebar(!activeSidebar)

    return (
        <>
            <Header sidebarOnClick={onToggleSidebar} />
            <div className="flex flex-row h-full w-full">
                <Sidebar isActive={activeSidebar}  children={""}/>
                <Navigation />
            </div>
        </>
    );
}
