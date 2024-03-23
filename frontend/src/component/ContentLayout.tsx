// ContentLayout.tsx
import React, { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface ContentLayoutProps {
    children: ReactNode;
    activeSidebar: boolean;
    onToggleSidebar: () => void;
}

export default function ContentLayout({ children, activeSidebar, onToggleSidebar }: ContentLayoutProps) {
    return (
        <>
            <Header sidebarOnClick={onToggleSidebar} />
            <div className="flex flex-row h-full w-full">
                <Sidebar isActive={activeSidebar} />
                {children}
            </div>
        </>
    );
}
