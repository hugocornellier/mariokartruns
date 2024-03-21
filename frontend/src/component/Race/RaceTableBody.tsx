import {Link} from "react-router-dom";
import {Util} from "../../utils/Util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faVideoCamera} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";
import {SocketHelper} from "../../context/SocketHelper";

export default function RaceTableBody(props: any) {
    return (
        <>
            <tbody>
            {props.raceData.map((record: {
                days: any;
                active_wr: boolean;
                date: string;
                nation: string;
                shrooms: string;
                character: string;
                video_url: any;
                player: string;
                time: string;
                race: string;
            }, i: number) => (
                <>
                    {props.isTrackList ? (
                        <tr key={i}>
                            <td data-label="Race">
                                <Link
                                    className={"cursor-pointer"}
                                    to={`/${props.game}/${record.race.replace(/ /g, "+")}${props.cc === '200cc' ? '/200cc' : ''}`}
                                >
                                    {record.race}
                                </Link>
                            </td>
                            <td data-label="Record">
                                {record.time}
                            </td>
                            <td data-label="Player">
                                <Link
                                    className={"cursor-pointer"}
                                    to={`/${props.game}/player/` + record.player.replace(/ /g, "+")}
                                >
                                    {record.player}
                                </Link>
                            </td>
                            <td data-label="Length">
                                {record.days}
                            </td>
                        </tr>
                    ) : (
                        <tr key={i} className={Util.pageDirIsMK8OrMK8DX() && i === 0 || record.active_wr ? "gold-tr" : ""}>
                            <td data-label="Crown">
                                {(Util.pageDirIsMK8OrMK8DX() && i === 0 || record.active_wr) && (
                                    <FontAwesomeIcon color={"#9a8015"} icon={faCrown}/>
                                )}
                                {record.video_url !== "0" && (
                                    <FontAwesomeIcon className={"ml-1.5"} icon={faVideoCamera}/>
                                )}
                            </td>
                            <td data-label="Time">
                                {record.video_url !== "0" ? (
                                    <Link
                                        target={"_blank"}
                                        className={"cursor-pointer"}
                                        to={record.video_url}
                                    >
                                        {record.time}
                                    </Link>
                                ) : (
                                    <>{record.time}</>
                                )}
                            </td>
                            <td data-label={props.tableLabelCol2}>
                                {
                                    <Link
                                        className={"cursor-pointer"}
                                        to={
                                            props.tableLabelCol2 === "Player"
                                                ? `/${props.game}/player/` +
                                                record.player.replace(/ /g, "+")
                                                : `/${props.game}/` + record.race.replace(/ /g, "+")
                                        }
                                    >
                                        {props.tableLabelCol2 === "Player"
                                            ? record.player
                                            : record.race}
                                    </Link>
                                }
                            </td>
                            <td data-label="Character">{record.character}</td>
                            <td data-label="Shrooms">{record.shrooms}</td>
                            <td data-label="Country">{record.nation}</td>
                            <td data-label="Date">{record.date}</td>
                            <td data-label="Length">{record.days}</td>
                        </tr>
                    )}
                </>
            ))}
            </tbody>
        </>
    )
}
