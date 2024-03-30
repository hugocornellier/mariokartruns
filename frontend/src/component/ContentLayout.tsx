import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface ContentLayoutProps {
    children: ReactNode;
    activeSidebar: boolean;
    toggleSidebar: () => void;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ children, activeSidebar, toggleSidebar }) => {
    return (
        <div className="bcontent w-full">
            <Header sidebarOnClick={toggleSidebar} />
            <div className="flex flex-row h-full w-full">
                <Sidebar isActive={activeSidebar} />
                {children}
            </div>
        </div>
    );
}

export default ContentLayout;
