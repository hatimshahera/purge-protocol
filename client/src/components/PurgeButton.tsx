// 📁 client/src/components/PurgeButton.tsx
// Allow player to call purge if they want (Updated → show player name instead of ID)

import React from "react";
import { socket } from "../api/socket";
import { Player } from "../hooks/useGame";

export default function PurgeButton({ roomId, purgeCalledBy, players }: { roomId: string; purgeCalledBy: string | null; players: Player[] }) {
    function callPurge() {
        socket.emit("call_purge", { roomId });
    }

    // Resolve player name from player ID
    const purgePlayer = players.find(p => p.id === purgeCalledBy);

    return (
        <div style={{ marginTop: "20px" }}>
            {purgeCalledBy ? (
                <p>Purge called by: {purgePlayer ? purgePlayer.name : purgeCalledBy}</p>
            ) : (
                <button onClick={callPurge}>Call Purge</button>
            )}
        </div>
    );
}
