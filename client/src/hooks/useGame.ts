// 📁 client/src/hooks/useGame.ts
// Hook to manage game state and socket events (Updated → your_turn sync)

import { useEffect, useState } from "react";
import { socket, connectSocket } from "../api/socket";

export type Player = {
    id: string;
    name: string;
    totalScore?: number;
};

export type Card = {
    id: string;
    value: number;
    ability?: string;
    type: string;
};

export function useGame(roomId: string) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
    const [middleCard, setMiddleCard] = useState<Card | null>(null);
    const [hand, setHand] = useState<Card[]>([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [purgeCalledBy, setPurgeCalledBy] = useState<string | null>(null);

    useEffect(() => {
        connectSocket();

        socket.emit("join_room", { roomId, playerName: "Player" + Math.floor(Math.random() * 1000) });

        socket.on("room_update", (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on("player_ready", (playerId) => {
            // Handle ready state if needed later
        });

        socket.on("game_started", ({ players, firstPlayerId }) => {
            setPlayers(players);
            setCurrentPlayerId(firstPlayerId);
            setGameStarted(true);
        });

        socket.on("start_turns", ({ roomId }) => {
            // Not needed here → handled by next_player
        });

        socket.on("next_player", (playerId) => {
            setCurrentPlayerId(playerId);
        });

        // ✅ NEW → Sync "your_turn" to know when it's your turn
        socket.on("your_turn", () => {
            setCurrentPlayerId(socket.id ?? null);
        });
        

        socket.on("middle_card_updated", (card) => {
            setMiddleCard(card);
        });

        socket.on("card_drawn", (cardOrCards) => {
            if (Array.isArray(cardOrCards)) {
                setHand(cardOrCards);
            } else {
                setHand((prev) => [...prev, cardOrCards]);
            }
        });

        socket.on("play_result", (success) => {
            if (!success) {
                // Could show UI error → wrong match
            }
        });

        socket.on("player_action", (action) => {
            // Show action UI if needed
        });

        socket.on("purge_called", (playerId) => {
            setPurgeCalledBy(playerId ?? null);
        });

        socket.on("game_ended", ({ scores, totalScores }) => {
            // Show game end UI
        });

        socket.on("match_ended", ({ winners }) => {
            // Show match end UI
        });

        return () => {
            socket.off();
        };
    }, [roomId]);

    return {
        players,
        currentPlayerId,
        middleCard,
        hand,
        gameStarted,
        purgeCalledBy,
        socket,
    };
}
