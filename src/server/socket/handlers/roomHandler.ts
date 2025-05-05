// 📁 src/server/socket/handlers/roomHandler.ts
// Handles room actions (join, ready, start game) (SAFE PATCHED VERSION + PATCH 2 → FIXED GAME START BROADCAST)

import { Server, Socket } from "socket.io";
import { Room } from "../../models/room";
import { GameState } from "../../game/state";
import { GameEngine } from "../../game/engine";
import { Player } from "../../game/player";
import { generateBaseDeck } from "../../game/deckFactory";
import { rooms } from "../roomStore";

export function registerRoomHandlers(io: Server, socket: Socket) {
    // Join room
    socket.on("join_room", ({ roomId, playerName }: { roomId: string; playerName: string }) => {
        let data = rooms.get(roomId);

        // ✅ Only create the room (empty) if not exists, no player auto creation
        if (!data) {
            const newRoom = new Room(roomId, socket.id);
            rooms.set(roomId, { room: newRoom });
            data = rooms.get(roomId)!;
        }

        // ✅ Only here when player joins → create Player
        const player = new Player(socket.id, playerName);
        const success = data.room.addPlayer(player);

        if (!success) {
            socket.emit("join_failed", "Room full or game already started");
            return;
        }

        socket.join(roomId);
        io.to(roomId).emit("room_update", data.room.players);
    });

    // Mark player as ready
    socket.on("ready", ({ roomId }: { roomId: string }) => {
        const data = rooms.get(roomId);
        if (!data) return;

        data.room.markReady(socket.id);
        io.to(roomId).emit("player_ready", socket.id);

        // Start game if all ready
        if (data.room.areAllReady()) {
            const players = data.room.players;
            const deck = generateBaseDeck();

            const state = new GameState(players, deck);
            const engine = new GameEngine(state);

            data.engine = engine;

            // ✅ FIXED → Emit to entire room → reliable broadcast
            io.to(roomId).emit("game_started", {
                players: players.map((p: any) => ({ id: p.id, name: p.name })),
                firstPlayerId: state.getCurrentPlayer().id,
                deckSize: deck.length
            });

            // Send middle card to all players
            io.to(roomId).emit("middle_card_updated", state.middleCard);

            // Send starting hand to each player individually (using new getter)
            const hands = state.getHands();
            for (const player of players) {
                const hand = hands.get(player.id) ?? [];
                io.to(player.id).emit("card_drawn", hand);
            }

            // Automatically start the first turn
            io.to(roomId).emit("start_turns", { roomId });

            // Notify first player to begin their turn immediately → ONLY to that player
            const currentPlayer = state.getCurrentPlayer();
            io.to(currentPlayer.id).emit("your_turn", {});
        }
    });

    // Leave room
    socket.on("disconnect", () => {
        for (const [roomId, data] of rooms.entries()) {
            data.room.removePlayer(socket.id);
            io.to(roomId).emit("room_update", data.room.players);

            if (data.room.players.length === 0) {
                rooms.delete(roomId);
            }
        }
    });
}
