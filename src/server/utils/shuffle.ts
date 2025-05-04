// 📁 src/server/utils/shuffle.ts
// Utility for shuffling cards (Fisher-Yates shuffle)

import { Card } from "../game/card";

/**
 * Shuffle an array of cards in-place
 * @param cards Array of cards
 * @returns Shuffled array (same reference)
 */
export function shuffle(cards: Card[]): Card[] {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
}
