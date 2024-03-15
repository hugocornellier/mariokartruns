import { Socket } from "socket.io-client";
import { SocketHelper } from "../context/SocketHelper";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RaceTable(props:any) {
    const [raceData, setRaceData] = useState<any[]>();

    // Socket.io setup & calls
    const [socket, setSocket] = useState<Socket>();
    useEffect(() => {
        setSocket(SocketHelper.init());
    }, []);
    useEffect(() => {
        if (!socket) return;
        socket.emit("get_race_data", props.raceName);
        socket.on("get_race_data_ret", (data: any) => {
            setRaceData(data);
        });
        return () => {
            socket.off();
        };
    }, [socket]);

    return (
        <div>
            <div className="container">
                <table className="responsive-table">
                    <thead className="responsive-table__head">
                    <tr className="responsive-table__row">
                        <th className="responsive-table__head__title responsive-table__head__title--types">
                            Time
                        </th>
                        <th className="responsive-table__head__title responsive-table__head__title--status">
                            Player
                        </th>
                        <th className="responsive-table__head__title responsive-table__head__title--name">
                            Date
                        </th>
                        <th className="responsive-table__head__title responsive-table__head__title--update">
                            Length
                        </th>
                        <th className="responsive-table__head__title responsive-table__head__title--country">
                            Country
                        </th>
                    </tr>
                    </thead>

                    <tbody className="responsive-table__body">
                    {!raceData ? (
                        <div>Loading...</div>
                    ) : (
                        <div>
                            {raceData.map((record, i) => (
                                <tr className="responsive-table__row">
                                    <td className="responsive-table__body__text responsive-table__body__text--name">
                                        {record.video_url != 0 && record.video_url != "0" ?
                                            <Link target="_blank" to={record.video_url}>
                                                { record.time }
                                            </Link> :
                                            <>
                                                { record.time }
                                            </>
                                        }
                                    </td>
                                    <td className="responsive-table__body__text responsive-table__body__text--status">
                                        <Link to={ "/mk8/player/" + record.player }>
                                            { record.player }
                                        </Link>
                                    </td>
                                    <td className="responsive-table__body__text responsive-table__body__text--types">
                                        { record.date }
                                    </td>
                                    <td className="responsive-table__body__text responsive-table__body__text--update">
                                        { record.days }
                                    </td>
                                    <td className="responsive-table__body__text responsive-table__body__text--country">
                                        { record.nation }
                                    </td>
                                </tr>
                            ))}
                        </div>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
