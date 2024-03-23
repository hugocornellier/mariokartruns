import { Util } from "../utils/Util";
import { useCallback, ReactNode } from "react";

interface TabsProps {
    cc: string;
}

export default function Tabs(props: TabsProps) {
    const openTab = useCallback((cc: string) => {
        if (Util.pageDirIsMK8OrMK8DX()) {
            const path = Util.getPath();
            Util.goToPage(path.endsWith('/200cc') ? path.slice(0, -6) : path + '/200cc');
        } else {
            Util.goToPage('/mk8dx' + (cc === '200cc' ? '/200cc' : ''))
        }
    }, []);

    return (
        <div className="tabs flex flex-row mb-6 h-10">
            <TabButton onClick={() => openTab('150cc')} active={props.cc === "150cc"}>150cc</TabButton>
            <TabButton onClick={() => openTab('200cc')} active={props.cc === "200cc"}>200cc</TabButton>
        </div>
    );
}

interface TabButtonProps {
    onClick: () => void;
    active: boolean;
    children: ReactNode;
}

function TabButton({ onClick, active, children }: TabButtonProps) {
    return (
        <div onClick={onClick} className={`mr-5 ${active ? 'active' : ''}`}>
            {children}
        </div>
    );
}
