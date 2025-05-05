// 📁 client/src/components/Lobby.tsx
// Join room + ready screen

import React, { useState, useEffect } from "react";
import { socket, connectSocket } from "../api/socket";

export default function Lobby({ roomId }: { roomId: string }) {
    const [players, setPlayers] = useState<{ id: string; name: string }[]>([]);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        connectSocket();

        socket.emit("join_room", { roomId, playerName: "Player" + Math.floor(Math.random() * 1000) });

        socket.on("room_update", (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on("player_ready", (playerId) => {
            // Optional: show ready state per player (not done here yet)
        });

        return () => {
            socket.off();
        };
    }, [roomId]);

    function markReady() {
        socket.emit("ready", { roomId });
        setReady(true);
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Lobby - Room ID: {roomId}</h2>

            <h3>Players</h3>
            <ul>
                {players.map((player) => (
                    <li key={player.id}>{player.name}</li>
                ))}
            </ul>

            {ready ? (
                <p>Waiting for others to be ready...</p>
            ) : (
                <button onClick={markReady}>Ready</button>
            )}
        </div>
    );
}
