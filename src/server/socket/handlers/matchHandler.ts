// 📁 src/server/socket/handlers/matchHandler.ts
// Handles end of game scoring and match flow (SAFE PATCHED VERSION)

import { Server, Socket } from "socket.io";
import { Room } from "../../models/room";
import { GameEngine } from "../../game/engine";
import { Match } from "../../models/match";
import { rooms } from "../roomStore";
import { generateBaseDeck } from "../../game/deckFactory";
import { GameState } from "../../game/state";

export function registerMatchHandlers(io: Server, socket: Socket) {
    // End current game and calculate scores
    socket.on("end_game", ({ roomId }: { roomId: string }) => {
        const data = rooms.get(roomId);
        if (!data || !data.engine || !data.match) return;

        const { engine, match, room } = data;

        // Calculate scores for this game
        const scores = engine.calculateScores();

        // Notify players of game scores
        io.to(roomId).emit("game_ended", {
            scores: scores.map(s => ({ playerId: s.player.id, score: s.score })),
            totalScores: room.players.map(p => ({ playerId: p.id, totalScore: p.score }))
        });

        // Check if match is over
        if (match.isMatchOver()) {
            const winners = match.getWinners();

            io.to(roomId).emit("match_ended", {
                winners: winners.map(w => ({ playerId: w.id, totalScore: w.score }))
            });

            // Cleanup room after match
            rooms.delete(roomId);
        } else {
            // Start next game in match
            match.startNextGame();
            match.resetPlayersForNextGame();

            const deck = generateBaseDeck();
            const state = new GameState(room.players, deck);
            const engine = new GameEngine(state);

            data.engine = engine;

            io.to(roomId).emit("next_game_started", {
                gameNumber: match.currentGameNumber,
                players: room.players.map(p => ({ id: p.id, name: p.name })),
                firstPlayerId: state.getCurrentPlayer().id,
                deckSize: deck.length
            });

            // Start turns again
            io.to(roomId).emit("start_turns", { roomId });
        }
    });
}
