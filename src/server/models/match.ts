// 📁 src/server/models/match.ts
// Match logic (multi-game match, cumulative scores)

import { Player } from "../game/player";

export class Match {
    players: Player[];
    totalGames: number;
    currentGameNumber: number;

    constructor(players: Player[], totalGames: number) {
        this.players = players;
        this.totalGames = totalGames;
        this.currentGameNumber = 1;
    }

    /**
     * Start next game if available
     */
    startNextGame(): boolean {
        if (this.currentGameNumber < this.totalGames) {
            this.currentGameNumber++;
            return true;
        }
        return false;
    }

    /**
     * Check if match is over
     */
    isMatchOver(): boolean {
        return this.currentGameNumber >= this.totalGames;
    }

    /**
     * Get match winner(s) based on lowest cumulative score
     */
    getWinners(): Player[] {
        const lowestScore = Math.min(...this.players.map(p => p.score));
        return this.players.filter(p => p.score === lowestScore);
    }

    /**
     * Reset players hands and prepare for next game (game-specific logic can call this)
     */
    resetPlayersForNextGame() {
        for (const player of this.players) {
            player.hand = [];
            player.seenCards = [];
            player.isActive = true;
        }
    }
}
