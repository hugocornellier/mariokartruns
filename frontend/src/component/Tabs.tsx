import React from "react";
import { Link } from "react-router-dom";
import { Util } from "../utils/Util";

interface TabsProps {
    cc: string;
}

const Tabs: React.FC<TabsProps> = () => {
    const _200ccActive: boolean = Util.getPath().endsWith('200cc');

    return (
        <div className="tabs flex flex-row mb-6 h-10">
            <TabButton cc="150cc" active={!_200ccActive} />
            <TabButton cc="200cc" active={_200ccActive} />
        </div>
    );
};

interface TabButtonProps {
    active: boolean;
    cc: string;
}

const TabButton: React.FC<TabButtonProps> = ({ cc, active }) => {
    let raceUrl: string = '/mk8dx';
    raceUrl += Util.onTrackList()
        ? `${ cc === '200cc' ? '/200cc' : '' }`
        : `/${ Util.prepareURL(Util.getRaceName()) }${ cc === '200cc' ? '/200cc' : '' }`;

    return (
        <Link to={raceUrl}>
            <div className={`mr-5 ${active ? 'active' : ''}`}>
                {cc}
            </div>
        </Link>
    );
};

export default Tabs;
