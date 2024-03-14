import React from "react";
import HomePage from "./component/HomePage";

function App() {
  return (
    <div className="flex flex-row h-full w-full text-white">
      <div className="pl-10 pt-5 h-screen" style={{minWidth: '300px', background: '#242222'}}>
        <div>
          Home
        </div>
        <div className="mt-10">
          <b>
            Games
          </b>
        </div>
        <div className="mt-5">
          Mario Kart 8
        </div>
      </div>
      <div className="pl-10 pt-5 w-full">
        Welcome to MK Records!
      </div>
    </div>
  );
}

export default App;
