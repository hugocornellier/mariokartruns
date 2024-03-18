export default function RaceTitle(props : any) {
    return (
      <div className="text-black">
        <span className="mr-5 rounded-md" style={{ background: "#d6eeb9", display: "inline-block", padding: "5px 10px" }}>
          MK8
        </span>
        <span style={{fontSize: "20px", display: "inline-block"}}>
        {
          props.raceName.length > 0
            ? props.raceName
            : "..."
        }
        </span>
      </div>
    )
  }
  