import {Link} from "react-router-dom";

export default function Header(props: any) {
    return (
        <div className="mkr-header items-center p-4 flex flex-row w-full text-white">
            <div onClick={props.sidebarOnClick} className={"sidebar-btn p-2 mr-4 cursor-pointer border-2 rounded-lg"}>
                ≡
            </div>
            <Link to={"/"}>
                <div className={"flex flex-row items-center cursor-pointer"}>
                    <img
                        src={require('../img/logo.png')}
                        className="logo mr-3"
                        alt={"MarioKartRuns Logo"}
                    />
                    MarioKartRuns
                </div>
            </Link>
        </div>
    )
}
