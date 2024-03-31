import React from "react";

interface RaceTableHeaderProps {
    labels: string[];
}

const RaceTableHeader: React.FC<RaceTableHeaderProps> = ({ labels }) => {
    return (
        <thead>
            <tr>
                {labels.map((label, index) => (
                    <th key={index}>
                        {label}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export default RaceTableHeader;
