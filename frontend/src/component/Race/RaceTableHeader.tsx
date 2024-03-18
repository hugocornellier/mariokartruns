export default function RaceTableHeader(props: any) {
    return (
        <>
            <thead>
                <tr>
                {props.labels.map(
                    (record: {
                        toString: () => string | null },
                        i: number
                    ) => (
                        <th key={i}>
                            {record.toString()}
                        </th>
                    )
                )}
                </tr>
            </thead>
        </>
    )
}
