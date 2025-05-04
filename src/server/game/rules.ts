// 📁 src/server/game/rules.ts
// Handles special card abilities (Themed cards logic)

import { Card, CardAbility } from "./card";
import { Player } from "./player";

export class GameRules {

    /**
     * Execute the ability of a themed card
     * @param card The themed card played
     * @param currentPlayer The player who played the card
     * @param targetPlayer (Optional) The target player for the ability
     * @param handIndex (Optional) Index of own hand (for swap or discard)
     */
    static executeAbility(card: Card, currentPlayer: Player, targetPlayer?: Player, handIndex?: number) {
        if (!card.ability) return;

        switch (card.ability) {
            case CardAbility.LOOK_OWN:
                if (handIndex !== undefined) {
                    const seenCard = currentPlayer.viewCard(handIndex);
                    console.log(`Player ${currentPlayer.name} viewed own card:`, seenCard);
                }
                break;

            case CardAbility.LOOK_OPPONENT:
                if (targetPlayer && handIndex !== undefined) {
                    const seenCard = targetPlayer.viewCard(handIndex);
                    console.log(`Player ${currentPlayer.name} viewed opponent's card:`, seenCard);
                }
                break;

            case CardAbility.SWAP_BLIND:
                if (targetPlayer && handIndex !== undefined) {
                    const myCard = currentPlayer.removeCard(handIndex);
                    const opponentCard = targetPlayer.removeCard(handIndex);
                    if (myCard && opponentCard) {
                        currentPlayer.addCard(opponentCard);
                        targetPlayer.addCard(myCard);
                    }
                }
                break;

            case CardAbility.DISCARD:
                if (handIndex !== undefined) {
                    const discarded = currentPlayer.removeCard(handIndex);
                    console.log(`Player ${currentPlayer.name} discarded card:`, discarded);
                }
                break;

            case CardAbility.GIVE:
                if (targetPlayer && handIndex !== undefined) {
                    const givenCard = currentPlayer.removeCard(handIndex);
                    if (givenCard) targetPlayer.addCard(givenCard);
                }
                break;

            case CardAbility.LOOK_AND_SWAP:
                if (targetPlayer && handIndex !== undefined) {
                    const seenCard = targetPlayer.viewCard(handIndex);
                    console.log(`Player ${currentPlayer.name} viewed target card:`, seenCard);
                    const myCard = currentPlayer.removeCard(handIndex);
                    if (myCard && seenCard) {
                        currentPlayer.addCard(seenCard);
                        targetPlayer.removeCard(handIndex);
                        targetPlayer.addCard(myCard);
                    }
                }
                break;

            case CardAbility.DUAL_LOOK:
                console.log("Dual Look ability triggered. Choice logic depends on UI input.");
                break;

            default:
                console.log("Unknown ability. No action.");
                break;
        }
    }
}
