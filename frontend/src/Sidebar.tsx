
function Sidebar() {
  return (
    <div className="pl-10 pt-5 text-white min-h-screen" style={{width: '300px', background: 'rgb(6, 33, 72)'}}>
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
