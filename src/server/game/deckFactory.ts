// 📁 src/server/game/deckFactory.ts
// Deck generation logic (base game deck)

import { Card, CardAbility, CardType, createNormalCard, createThemedCard } from "./card";
import { shuffle } from "../utils/shuffle";

/**
 * Generate the base deck of cards for the standard game mode
 * @returns Shuffled array of cards
 */
export function generateBaseDeck(): Card[] {
    const cards: Card[] = [];

    // Add normal cards (1-6 → 4 copies each)
    for (let value = 1; value <= 6; value++) {
        for (let i = 0; i < 4; i++) {
            cards.push(createNormalCard(value));
        }
    }

    // Add normal cards (7-8 → Look at own → 4 copies each)
    for (let value = 7; value <= 8; value++) {
        for (let i = 0; i < 4; i++) {
            cards.push(createThemedCard(CardAbility.LOOK_OWN));
        }
    }

    // Add normal cards (9-10 → Look at opponent → 4 copies each)
    for (let value = 9; value <= 10; value++) {
        for (let i = 0; i < 4; i++) {
            cards.push(createThemedCard(CardAbility.LOOK_OPPONENT));
        }
    }

    // Themed cards

    // Swap Blind → 4x
    for (let i = 0; i < 4; i++) cards.push(createThemedCard(CardAbility.SWAP_BLIND));

    // +20 → 4x (Special point cards → value assigned directly in game logic)
    for (let i = 0; i < 4; i++) cards.push(createNormalCard(20));

    // Zero → 2x → Null card
    for (let i = 0; i < 2; i++) cards.push(createNormalCard(0));

    // Dual Look → 2x
    for (let i = 0; i < 2; i++) cards.push(createThemedCard(CardAbility.DUAL_LOOK));

    // +25 → 2x (Overflow Injector)
    for (let i = 0; i < 2; i++) cards.push(createNormalCard(25));

    // -1 → 1x
    cards.push(createNormalCard(-1));

    // Discard → 3x
    for (let i = 0; i < 3; i++) cards.push(createThemedCard(CardAbility.DISCARD));

    // Gift → 1x
    cards.push(createThemedCard(CardAbility.GIVE));

    // Look and Swap → 1x
    cards.push(createThemedCard(CardAbility.LOOK_AND_SWAP));

    // Shuffle deck
    shuffle(cards);

    return cards;
}
