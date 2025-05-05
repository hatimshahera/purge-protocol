// 📁 client/src/components/GameBoard.tsx
// Main game UI → show players, middle card, hand, purge button

import React from "react";
import { useGame } from "../hooks/useGame";
import PlayerList from "./PlayerList";
import PlayerHand from "./PlayerHand";
import PurgeButton from "./PurgeButton";
import Card from "./Card";

export default function GameBoard({ roomId }: { roomId: string }) {
    const {
        players,
        currentPlayerId,
        middleCard,
        hand,
        gameStarted,
        purgeCalledBy,
        socket,
    } = useGame(roomId);

    if (!gameStarted) return <div>Waiting for game to start...</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Game Board</h2>

            <PlayerList players={players} currentPlayerId={currentPlayerId} />

            <div style={{ margin: "20px 0" }}>
                <h3>Middle Card</h3>
                {middleCard ? (
                    <Card card={middleCard} />
                ) : (
                    <p>No card yet</p>
                )}
            </div>

            <PlayerHand hand={hand} roomId={roomId} />

            <PurgeButton roomId={roomId} purgeCalledBy={purgeCalledBy} players={players} />

            <div style={{ marginTop: "20px" }}>
                {currentPlayerId === socket.id ? (
                    <button onClick={() => socket.emit("end_turn", { roomId })}>End Turn</button>
                ) : (
                    <p>Waiting for other players...</p>
                )}
            </div>
        </div>
    );
}
