// 📁 src/server/game/engine.ts
// Core game engine logic (turn actions, purge handling, scoring)

import { Card, CardType, CardAbility } from "./card";
import { Player } from "./player";
import { GameState } from "./state";

export class GameEngine {
    state: GameState;

    constructor(state: GameState) {
        this.state = state;
    }

    /**
     * Player draws a card from the deck
     */
    drawCard(player: Player): Card | null {
        const card = this.state.drawCard();
        if (!card) return null;

        return card;
    }

    /**
     * Player swaps a drawn card with their hand or drops it to middle
     */
    swapOrDrop(player: Player, handIndex: number | null, drawnCard: Card) {
        if (handIndex !== null) {
            // Swap with hand
            const swappedCard = player.swapCard(handIndex, drawnCard);
            if (swappedCard) this.state.setMiddleCard(swappedCard);
        } else {
            // Drop to middle
            this.state.setMiddleCard(drawnCard);
        }
    }

    /**
     * Player plays a hand card if it matches the middle card (or special rule for Overflow Injector)
     */
    playMatchingCard(player: Player, handIndex: number): boolean {
        const handCard = player.viewCard(handIndex);
        const middleCard = this.state.middleCard;

        if (!handCard || !middleCard) return false;

        const isSpecialPlay = handCard.ability === CardAbility.LOOK_AND_SWAP && middleCard.ability === CardAbility.DUAL_LOOK;

        if (handCard.value === middleCard.value || isSpecialPlay) {
            // Successful match or special play
            player.removeCard(handIndex);
            this.state.setMiddleCard(handCard);
            return true;
        } else {
            // Failed match → player takes middle card too
            const takenMiddle = this.state.middleCard;
            if (takenMiddle) player.addCard(takenMiddle);
            return false;
        }
    }

    /**
     * Player discards a card using a discard ability
     */
    discardCard(player: Player, handIndex: number): Card | null {
        return player.removeCard(handIndex);
    }

    /**
     * Calculate scores for all players at end of round
     */
    calculateScores(): { player: Player, score: number }[] {
        return this.state.players.map(player => {
            const score = player.calculateScore();
            player.score += score; // Add to cumulative score
            return { player, score };
        });
    }

    /**
     * Check if Purge has been called
     */
    isPurgePhase(): boolean {
        return this.state.isPurgePhase();
    }

    /**
     * Call Purge by player
     */
    callPurge(player: Player) {
        this.state.callPurge(player);
    }

    /**
     * Move to next turn
     */
    nextTurn() {
        this.state.nextPlayer();
    }
}
