import RaceTitle from "./RaceTitle"
import RaceTable from "./RaceTable"
import { Util } from "../utils/Util"
import {
    useEffect,
    useState
} from "react"

export default function Race() {
    const [raceName, setRaceName] = useState("")
    useEffect(() => {
        setRaceName(Util.getPageLocation())
    }, [])

    return (
      <>
        <RaceTitle raceName={raceName} />
        <RaceTable raceName={raceName} />
      </>
    )
  }
  