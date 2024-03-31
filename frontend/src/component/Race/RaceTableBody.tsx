import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import { Util } from "../../utils/Util";

interface TableRowProps {
    record: any;
    game: string;
    cc?: string;
    isTrackList: boolean;
    tableLabelCol2: string;
}

interface RaceTableBodyProps {
    raceData: any[];
    game: string;
    cc?: string;
    isTrackList: boolean;
    tableLabelCol2: string;
}

const RaceTableBody: React.FC<RaceTableBodyProps> = ({ raceData, game, cc, isTrackList, tableLabelCol2 }) => {
    return (
        <tbody>
            {raceData.map((record, i) => (
                <React.Fragment key={i}>
                    {isTrackList && <TrackListRow record={record} game={game} cc={cc} isTrackList={isTrackList} tableLabelCol2={tableLabelCol2} />}
                    {cc === 'all' && <AllRow cc={cc} record={record} />}
                    {(Util.onRacePage() || Util.pageDirIsPlayer()) && <RacePageRow i={i} record={record} game={game} tableLabelCol2={tableLabelCol2} />}
                </React.Fragment>
            ))}
        </tbody>
    );
}


const TrackListRow: React.FC<TableRowProps> = ({ record, game, cc }) => {
    return (
        <tr>
            <td data-label="Race">
                <Link className="cursor-pointer" to={`/${game}/${Util.prepareURL(record.race)}${cc === '200cc' ? '/200cc' : ''}`}>
                    {record.race}
                </Link>
            </td>
            <td data-label="Time">
                {record.video_url !== "0"
                    ? (
                        <Link target="_blank" className="cursor-pointer" to={record.video_url}>
                            {record.time}
                        </Link>
                    )
                    : record.time
                }
            </td>
            <td data-label="Player">
                <Link className="cursor-pointer" to={`/${game}/player/${Util.prepareURL(record.player)}`}>
                    {record.player}
                </Link>
            </td>
            <td data-label="Date">{record.date}</td>
        </tr>
    );
}

const AllRow: React.FC<{ record: any; cc: string; }> = ({ record, cc }) => {
    console.log(record)
    return (
        <tr>
            <td data-label="Date">{record.date}</td>
            <td data-label="Game">
                <Link to={"/" + record.table_name}>
                    {record.table_name.toUpperCase()}
                </Link>
            </td>
            <td data-label="Race">
                <Link to={`/${record.table_name}/${Util.prepareURL(record.race)}${record.cc === '200cc' ? '/200cc' : ''}`}>
                    {record.race}
                    {(record.table_name == "mk8dx") && (" (" + record.cc + ")") }
                </Link>
            </td>
            <td data-label="Time">
                {record.video_url !== "0"
                    ? (
                        <Link target="_blank" className="cursor-pointer" to={record.video_url}>
                            {record.time}
                        </Link>
                    )
                    : record.time
                }
            </td>
            <td data-label="Player">
                <Link to={`/${record.table_name}/player/${Util.prepareURL(record.player)}`}>
                    {record.player}
                </Link>
            </td>
        </tr>
    );
}

const RacePageRow: React.FC<{ i: number; record: any; game: string; tableLabelCol2: string }> = ({ i, record, game, tableLabelCol2 }) => {
    return (
        <tr className={(Util.pageDirIsMK8OrMK8DX() && i === 0) || record.active_wr ? "gold-tr" : ""}>
            <td data-label="Crown">
                {(Util.pageDirIsMK8OrMK8DX() && i === 0 || record.active_wr) && (
                    <FontAwesomeIcon color="#9a8015" icon={faCrown} />
                )}
                {record.video_url !== "0" && <FontAwesomeIcon className="ml-1.5" icon={faVideoCamera} />}
            </td>
            <td data-label="Time">
                {record.video_url !== "0"
                    ? (
                        <Link target="_blank" className="cursor-pointer" to={record.video_url}>
                            {record.time}
                        </Link>
                    )
                    : record.time
                }
            </td>
            <td data-label={tableLabelCol2}>
                <Link
                    className="cursor-pointer"
                    to={
                        tableLabelCol2 === "Player"
                            ? `/${game}/player/${Util.prepareURL(record.player)}`
                            : `/${game}/` + Util.prepareURL(record.race)
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

export default RaceTableBody;
