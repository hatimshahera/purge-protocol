// 📁 src/server/game/card.ts
// Card definition and card types

export enum CardType {
    NORMAL = 'normal',
    THEMED = 'themed'
}

export enum CardAbility {
    LOOK_OWN = "LOOK_OWN",
    LOOK_OPPONENT = "LOOK_OPPONENT",
    SWAP_BLIND = "SWAP_BLIND",
    DISCARD = "DISCARD",
    GIVE = "GIVE",
    LOOK_AND_SWAP = "LOOK_AND_SWAP",
    DUAL_LOOK = "DUAL_LOOK"
}

export interface Card {
    id: string;              // Unique ID for tracking
    value: number | null;    // Number value (Normal) or null (Themed)
    ability?: CardAbility;   // Themed card ability (optional)
    type: CardType;          // Card type
}

/**
 * Creates a normal card (1-10)
 * @param value - number from 1 to 10
 * @returns Card
 */
export function createNormalCard(value: number): Card {
    return {
        id: `normal-${value}-${Math.random().toString(36).substr(2, 9)}`,
        value,
        type: CardType.NORMAL
    };
}

/**
 * Creates a themed (special) card
 * @param ability - ability enum
 * @returns Card
 */
export function createThemedCard(ability: CardAbility): Card {
    return {
        id: `themed-${ability}-${Math.random().toString(36).substr(2, 9)}`,
        value: null,
        ability,
        type: CardType.THEMED
    };
}
