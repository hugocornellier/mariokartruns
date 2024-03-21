import {Util} from "../utils/Util";

export default function Tabs(props: any) {

    const openTab = (cc: string) => {
        if (Util.pageDirIsMK8OrMK8DX()) {
            const path = Util.getPath();
            Util.goToPage(path.endsWith('/200cc') ? path.slice(0, -6) : path + '/200cc');
        } else {
            Util.goToPage('/mk8dx' + (cc === '200cc' ? '/200cc' : ''))
        }
    };

    return (
        <div className={"tabs flex flex-row mb-6 h-10"}>
            <div onClick={() => openTab('150cc')} className={(props.cc === "150cc" && "active ") + "mr-5"}>
                150cc
            </div>
            <div onClick={() => openTab('200cc')} className={(props.cc === "200cc" && "active ") + ""}>
                200cc
            </div>
        </div>
    )
}