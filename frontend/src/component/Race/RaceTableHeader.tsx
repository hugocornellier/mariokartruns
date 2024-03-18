export default function RaceTableHeader(props: any) {
    return (
        <>
            <thead>
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
            </thead>
        </>
    )
}
