import {
  Route,
  Link,
} from "react-router-dom";

function Sidebar() {
  return (
    <div className="pl-10 pt-5 h-screen text-white" style={{width: '300px', background: 'grey'}}>
    <div>
      <a href="/">
        Home
      </a>
    </div>
    <div className="mt-10">
      <b>
        Games
      </b>
    </div>
    <div className="mt-5">
        <a href="/mk8">
          Mario Kart 8
        </a>
    </div>
  </div>
  );
}

export default Sidebar;
