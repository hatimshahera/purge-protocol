// 📁 client/src/App.tsx
// Main app → shows Lobby or GameBoard based on state

import React, { useState } from "react";
import Lobby from "./components/Lobby";
import GameBoard from "./components/GameBoard";

export default function App() {
    const [roomId, setRoomId] = useState<string>("");
    const [joined, setJoined] = useState(false);

    function joinRoom() {
        if (roomId.trim() !== "") {
            setJoined(true);
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Purge Protocol</h1>

            {!joined ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            ) : (
                <>
                    <Lobby roomId={roomId} />
                    <GameBoard roomId={roomId} />
                </>
            )}
        </div>
    );
}
