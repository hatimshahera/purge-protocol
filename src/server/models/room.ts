// 📁 src/server/models/room.ts
// Room logic (player joining, ready, starting game)

import { Player } from "../game/player";
import { Card } from "../game/card";

export class Room {
    id: string;
    players: Player[];
    maxPlayers: number;
    isGameStarted: boolean;
    hostId: string;
    readyPlayers: Set<string>;

    constructor(id: string, hostId: string, maxPlayers: number = 4) {
        this.id = id;
        this.players = [];
        this.maxPlayers = maxPlayers;
        this.isGameStarted = false;
        this.hostId = hostId;
        this.readyPlayers = new Set();
    }

    /**
     * Add player to the room
     */
    addPlayer(player: Player): boolean {
        if (this.players.length >= this.maxPlayers || this.isGameStarted) return false;
        this.players.push(player);
        return true;
    }

    /**
     * Remove player from room
     */
    removePlayer(playerId: string) {
        this.players = this.players.filter(p => p.id !== playerId);
        this.readyPlayers.delete(playerId);
    }

    /**
     * Mark player as ready
     */
    markReady(playerId: string) {
        this.readyPlayers.add(playerId);
    }

    /**
     * Check if all players are ready
     */
    areAllReady(): boolean {
        return this.players.length === this.maxPlayers && this.readyPlayers.size === this.maxPlayers;
    }

    /**
     * Start the game if possible
     */
    startGame(): boolean {
        if (this.areAllReady()) {
            this.isGameStarted = true;
            return true;
        }
        return false;
    }

    /**
     * Check if room is full
     */
    isFull(): boolean {
        return this.players.length >= this.maxPlayers;
    }

    /**
     * Get player by ID
     */
    getPlayer(playerId: string): Player | undefined {
        return this.players.find(p => p.id === playerId);
    }
}
