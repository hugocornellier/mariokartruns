import { 
    useEffect, 
    useState 
  } from "react"

export default function RaceTitle() {
    const [raceName, setRaceName] = useState("")
    useEffect(() => {
      const split = String(window.location).split("/")
      setRaceName(split[split.length - 1].split("+").join(' '))
    }, [])
  
    return (
      <div className="text-black">
        <span className="mr-5 rounded-md" style={{ background: "#d6eeb9", display: "inline-block", padding: "5px 10px" }}>
          MK8
        </span>
        {
          raceName.length > 0
            ? raceName
            : "..."
        }
      </div>
    )
  }
  