// 📁 client/src/components/PlayerList.tsx
// Show all players and highlight current player

import React from "react";
import { Player } from "../hooks/useGame";

export default function PlayerList({ players, currentPlayerId }: { players: Player[]; currentPlayerId: string | null }) {
    return (
        <div style={{ marginBottom: "20px" }}>
            <h3>Players</h3>
            <ul>
                {players.map((player) => (
                    <li
                        key={player.id}
                        style={{
                            fontWeight: player.id === currentPlayerId ? "bold" : "normal",
                            color: player.id === currentPlayerId ? "green" : "black",
                        }}
                    >
                        {player.name} {player.id === currentPlayerId ? "(Your Turn)" : ""}
                    </li>
                ))}
            </ul>
        </div>
    );
}
