// 📁 src/server/socket/handlers/gameHandler.ts
// Advanced game handling (turn order, timer, purge phase) (PATCH 5 → FIX end_turn logic → notify next player properly)

import { Server, Socket } from "socket.io";
import { rooms } from "../roomStore";
import { Room } from "../../models/room";
import { GameEngine } from "../../game/engine";
import { GameRules } from "../../game/rules";
import { Card, CardAbility } from "../../game/card";
import { TurnTimer } from "../../utils/timer";

export function registerGameHandlers(io: Server, socket: Socket) {

    // Helper → Start player's turn with timer
    function startPlayerTurn(roomId: string) {
        const data = rooms.get(roomId);
        if (!data || !data.engine) return;

        const currentPlayer = data.engine.state.getCurrentPlayer();

        // ✅ Only emit your_turn to current player
        io.to(currentPlayer.id).emit("your_turn", {});

        io.to(roomId).emit("next_player", currentPlayer.id);

        // Start timer
        data.timer?.clear();
        data.timer = new TurnTimer(60, () => {
            console.log("Player turn timeout");
            io.to(roomId).emit("player_timeout", currentPlayer.id);
            data.engine!.nextTurn();
            startPlayerTurn(roomId);
        });

        data.timer.start();
    }

    // Draw card
    socket.on("draw_card", ({ roomId }: { roomId: string }) => {
        const data = rooms.get(roomId);
        if (!data || !data.engine) return;

        const player = data.room.getPlayer(socket.id);
        if (!player) return;

        const card = data.engine.drawCard(player);
        if (card) {
            socket.emit("card_drawn", card);
        }
    });

    // Swap or drop card
    socket.on("swap_or_drop", ({ roomId }: { roomId: string }, handIndex, drawnCard) => {
        const data = rooms.get(roomId);
        if (!data || !data.engine) return;

        const player = data.room.getPlayer(socket.id);
        if (!player) return;

        data.engine.swapOrDrop(player, handIndex, drawnCard);
        io.to(roomId).emit("middle_card_updated", data.engine.state.middleCard);
    });

    // Play matching card
    socket.on("play_matching_card", ({ roomId }: { roomId: string }, handIndex) => {
        const data = rooms.get(roomId);
        if (!data || !data.engine) return;

        const player = data.room.getPlayer(socket.id);
        if (!player) return;

        const success = data.engine.playMatchingCard(player, handIndex);
        io.to(roomId).emit("middle_card_updated", data.engine.state.middleCard);
        socket.emit("play_result", success);
    });

    // Use themed card ability
    socket.on("use_ability", ({ roomId }: { roomId: string }, card, targetPlayerId, handIndex) => {
        const data = rooms.get(roomId);
        if (!data || !data.engine) return;

        const player = data.room.getPlayer(socket.id);
        const targetPlayer = targetPlayerId ? data.room.getPlayer(targetPlayerId) : undefined;

        if (!player) return;

        GameRules.executeAbility(card, player, targetPlayer, handIndex);
        io.to(roomId).emit("player_action", { playerId: socket.id, ability: card.ability });
    });

    // Call purge
    socket.on("call_purge", ({ roomId }: { roomId: string }) => {
        const data = rooms.get(roomId);
        if (!data || !data.engine) return;

        const player = data.room.getPlayer(socket.id);
        if (!player) return;

        if (!data.engine.state.canCallPurge()) {
            socket.emit("purge_failed", "Purge not allowed yet");
            return;
        }

        data.engine.callPurge(player);
        io.to(roomId).emit("purge_called", player.id);
    });

    // End turn
    socket.on("end_turn", ({ roomId }: { roomId: string }) => {
        const data = rooms.get(roomId);
        if (!data || !data.engine) return;

        data.timer?.clear();
        data.engine.nextTurn();

        // ✅ FIXED → notify room and current player properly after turn ends
        const nextPlayer = data.engine.state.getCurrentPlayer();
        io.to(roomId).emit("next_player", nextPlayer.id);
        io.to(nextPlayer.id).emit("your_turn", {});

        // Restart timer for next player
        data.timer = new TurnTimer(60, () => {
            console.log("Player turn timeout");
            io.to(roomId).emit("player_timeout", nextPlayer.id);
            data.engine!.nextTurn();
            startPlayerTurn(roomId);
        });

        data.timer.start();
    });

    // Auto start turn on game start (join handler should call this)
    socket.on("start_turns", ({ roomId }: { roomId: string }) => {
        startPlayerTurn(roomId);
    });
}
