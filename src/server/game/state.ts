// 📁 src/server/game/state.ts
// Game state (deck, middle card, players, turn order, round count, hands)

import { Card } from "./card";
import { Player } from "./player";

export class GameState {
    players: Player[];
    deck: Card[];
    middleCard: Card | null;
    currentPlayerIndex: number;
    roundNumber: number;
    purgeCalledBy: Player | null;

    // Store player hands
    private hands: Map<string, Card[]> = new Map();

    constructor(players: Player[], deck: Card[]) {
        this.players = players;
        this.deck = deck;
        this.middleCard = null;
        this.currentPlayerIndex = 0; // Start with first player
        this.roundNumber = 1;
        this.purgeCalledBy = null;

        this.hands = new Map();

        // Deal 4 cards to each player
        for (const player of players) {
            const hand = deck.splice(0, 4);
            this.hands.set(player.id, hand);
        }

        // Set middle card
        this.middleCard = deck.shift() ?? null;
    }

    /**
     * Get the current active player
     */
    getCurrentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    /**
     * Move to the next player's turn
     */
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

        // If we completed a full loop, increment round
        if (this.currentPlayerIndex === 0) {
            this.roundNumber++;
        }
    }

    /**
     * Draw a card from the deck
     * @returns Card or null if deck is empty
     */
    drawCard(): Card | null {
        return this.deck.length > 0 ? this.deck.pop()! : null;
    }

    /**
     * Set the middle revealed card
     * @param card Card to set as middle
     */
    setMiddleCard(card: Card) {
        this.middleCard = card;
    }

    /**
     * Check if purge can be called (after 4 rounds)
     */
    canCallPurge(): boolean {
        return this.roundNumber > 4 && this.purgeCalledBy === null;
    }

    /**
     * Call purge by a player
     * @param player Player who calls purge
     */
    callPurge(player: Player) {
        if (!this.canCallPurge()) return;
        this.purgeCalledBy = player;
    }

    /**
     * Check if game is in purge phase (after purge called)
     */
    isPurgePhase(): boolean {
        return this.purgeCalledBy !== null;
    }

    /**
     * Get player hands (for syncing to frontend)
     */
    public getHands() {
        return this.hands;
    }
}
