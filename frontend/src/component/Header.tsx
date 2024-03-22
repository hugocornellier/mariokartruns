import {Util} from "../utils/Util";

export default function Header(props: any) {
    return (
        <div className="mkr-header items-center p-4 flex flex-row w-full text-white">
            <div onClick={props.sidebarOnClick} className={"sidebar-btn p-2 mr-4 cursor-pointer border-2 rounded-lg"}>
                ≡
            </div>
            <div className={"flex flex-row items-center cursor-pointer"} onClick={() => Util.goToHome()}>
                <img
                    src={require('../img/logo.png')}
                    className="logo mr-3"
                    alt={"MarioKartRuns Logo"}
                />
                MarioKartRuns.io
            </div>
        </div>
    )
}
