// 📁 src/server/game/player.ts
// Player definition and actions

import { Card } from "./card";

export class Player {
    id: string;
    name: string;
    hand: Card[];
    seenCards: number[]; // Indexes of cards player has seen at start
    score: number;
    isActive: boolean;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
        this.hand = [];
        this.seenCards = [];
        this.score = 0;
        this.isActive = true; // Active unless disconnected or skipped
    }

    /**
     * Add card to player's hand
     * @param card Card to add
     */
    addCard(card: Card) {
        this.hand.push(card);
    }

    /**
     * Remove card from player's hand by index
     * @param index Index of card to remove
     * @returns Removed card
     */
    removeCard(index: number): Card | null {
        if (index < 0 || index >= this.hand.length) return null;
        return this.hand.splice(index, 1)[0];
    }

    /**
     * Swap card in hand with another card
     * @param index Index in hand to swap
     * @param newCard New card to insert
     * @returns Old card that was swapped out
     */
    swapCard(index: number, newCard: Card): Card | null {
        if (index < 0 || index >= this.hand.length) return null;
        const oldCard = this.hand[index];
        this.hand[index] = newCard;
        return oldCard;
    }

    /**
     * View a card in hand (for abilities like Look at own card)
     * @param index Index of card to view
     * @returns Card or null
     */
    viewCard(index: number): Card | null {
        if (index < 0 || index >= this.hand.length) return null;
        return this.hand[index];
    }

    /**
     * Calculate total score (sum of all card values, special cards count as their point value)
     */
    calculateScore(): number {
        return this.hand.reduce((total, card) => {
            if (card.value === null) return total; // Themed card → score calculated elsewhere if needed
            return total + card.value;
        }, 0);
    }

    /**
     * Mark a card as seen at start of the game
     * @param index Index of card seen
     */
    markSeen(index: number) {
        if (!this.seenCards.includes(index)) {
            this.seenCards.push(index);
        }
    }
}
