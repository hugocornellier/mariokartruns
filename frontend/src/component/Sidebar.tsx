import { Component } from "react";
import { Util } from "../utils/Util";

export default class Sidebar extends Component<{ children: any, isActive: any }> {
    render() {
        let { isActive } = this.props;
        return (
            <>
                {isActive && (
                    <div
                        // className={(sidebarHidden && "hidden ") + "class1 class2"}
                        className={"sidebar text-white min-h-screen hide-on-mobile"}
                        style={{ width: "300px", background: "rgb(6, 33, 72)" }}
                    >
                        <div className={"header"}>
                            <b>
                                Games
                            </b>
                        </div>
                        <div className="link" onClick={() => Util.goToPage("/mk8")}>
                            Mario Kart 8
                        </div>
                        <div className="link" onClick={() => Util.goToPage("/mk8dx")}>
                            Mario Kart 8 Deluxe
                        </div>
                    </div>
                )}
            </>
        );
    }
}