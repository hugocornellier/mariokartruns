import {Link} from "react-router-dom";
import {Util} from "../../utils/Util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCrown, faVideoCamera} from "@fortawesome/free-solid-svg-icons";
import {useEffect} from "react";

interface RaceRecord {
    cc: string;
    table_name: string;
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
}

interface TableRowProps {
    record: RaceRecord;
    game: string;
    cc?: string;
}

export default function RaceTableBody(props: any) {
    useEffect(() => {
        console.log(props.raceData)
    })
    return (
        <>
            <tbody>
            {props.raceData.map((record: {
                table_name: string;
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
                cc: string;
            }, i: number) => (
                <>
                    {props.isTrackList && <TrackListRow key={i} record={record} game={props.game} cc={props.cc} />}
                    {props.cc === 'all' && <AllRow key={i} record={record} />}
                    {(Util.onRacePage() || Util.pageDirIsPlayer()) && <RacePageRow i={i} key={i} record={record} game={props.game} tableLabelCol2={props.tableLabelCol2} />}
                </>
            ))}
            </tbody>
        </>
    )
}

function TrackListRow({ record, game, cc }: TableRowProps) {
    return (
        <tr>
            <td data-label="Race">
                <Link className="cursor-pointer" to={`/${game}/${record.race.replace(/ /g, "+")}${cc === '200cc' ? '/200cc' : ''}`}>
                    {record.race}
                </Link>
            </td>
            <td data-label="Record">{record.time}</td>
            <td data-label="Player">
                <Link className="cursor-pointer" to={`/${game}/player/${record.player.replace(/ /g, "+")}`}>
                    {record.player}
                </Link>
            </td>
            <td data-label="Date">{record.date}</td>
        </tr>
    );
}

function AllRow({ record }: { record: RaceRecord }) {
    return (
        <tr>
            <td data-label="Game">{record.table_name.toUpperCase()}</td>
            <td data-label="Race">
                <Link to={`/${record.table_name}/${record.race.replace(/ /g, "+")}${record.cc === '200cc' ? '/200cc' : ''}`}>
                    {record.race}
                </Link>
            </td>
            <td data-label="Record">{record.time}</td>
            <td data-label="Player">
                <Link to={`/${record.table_name}/player/${record.player.replace(/ /g, "+")}`}>
                    {record.player}
                </Link>
            </td>
            <td data-label="Length">{record.date}</td>
        </tr>
    );
}

function RacePageRow({ i, record, game, tableLabelCol2 }: { i: number; record: RaceRecord; game: string; tableLabelCol2: string }) {
    return (
        <tr className={(Util.pageDirIsMK8OrMK8DX() && i === 0) || record.active_wr ? "gold-tr" : ""}>
            <td data-label="Crown">
                {(Util.pageDirIsMK8OrMK8DX() && i === 0 || record.active_wr) && (
                    <FontAwesomeIcon color="#9a8015" icon={faCrown} />
                )}
                {record.video_url !== "0" && <FontAwesomeIcon className="ml-1.5" icon={faVideoCamera} />}
            </td>
            <td data-label="Time">
                {record.video_url !== "0" ? (
                    <Link target="_blank" className="cursor-pointer" to={record.video_url}>
                        {record.time}
                    </Link>
                ) : (
                    <>{record.time}</>
                )}
            </td>
            <td data-label={tableLabelCol2}>
                <Link
                    className="cursor-pointer"
                    to={
                        tableLabelCol2 === "Player"
                            ? `/${game}/player/${record.player.replace(/ /g, "+")}`
                            : `/${game}/` + record.race.replace(/ /g, "+")
                    }
                >
                    {tableLabelCol2 === "Player" ? record.player : record.race}
                </Link>
            </td>
            <td data-label="Character">{record.character}</td>
            <td data-label="Shrooms">{record.shrooms}</td>
            <td data-label="Country">{record.nation}</td>
            <td data-label="Date">{record.date}</td>
            <td data-label="Length">{record.days}</td>
        </tr>
    );
}
