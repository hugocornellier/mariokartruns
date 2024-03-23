import React from "react";
import { Link } from "react-router-dom";
import { Util } from "../utils/Util";

interface TabsProps {
    cc: string;
}

const Tabs: React.FC<TabsProps> = () => {
    return (
        <div className="tabs flex flex-row mb-6 h-10">
            <TabButton cc="150cc" active={!Util.getPath().endsWith('200cc')} />
            <TabButton cc="200cc" active={Util.getPath().endsWith('200cc')} />
        </div>
    );
};

interface TabButtonProps {
    active: boolean;
    cc: string;
}

const TabButton: React.FC<TabButtonProps> = ({ cc, active }) => {
    return (
        <Link to={`/mk8dx${cc === '200cc' ? '/200cc' : ''}`}>
            <div className={`mr-5 ${active ? 'active' : ''}`}>
                {cc}
            </div>
        </Link>
    );
};

export default Tabs;
