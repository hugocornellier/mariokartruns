export default function Sidebar(props: any) {
    return (
        <div
            ref={props.ref}
            className="pl-10 pt-5 text-white min-h-screen hide-on-mobile"
            style={{ width: "300px", background: "rgb(6, 33, 72)" }}
        >
            <div>
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
