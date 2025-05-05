// 📁 client/src/components/PlayerHand.tsx
// Show player's hand and allow actions (Improved version with Card component + clarity)

import React from "react";
import { Card as CardType } from "../hooks/useGame";
import { socket } from "../api/socket";
import Card from "./Card";

export default function PlayerHand({ hand, roomId }: { hand: CardType[]; roomId: string }) {
    function playMatching(index: number) {
        socket.emit("play_matching_card", { roomId, handIndex: index });
    }

    function useAbility(card: CardType, index: number) {
        if (!card.ability) return;

        socket.emit("use_ability", {
            roomId,
            card,
            targetPlayerId: undefined,
            handIndex: index
        });
    }

    return (
        <div>
            <h3>Your Hand</h3>
            <div style={{ display: "flex", gap: "10px" }}>
                {hand.map((card, index) => (
                    <div
                        key={index}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                        {/* Clickable card to play match */}
                        <Card card={card} onClick={() => playMatching(index)} />

                        {/* Optional ability button if ability exists */}
                        {card.ability && (
                            <button onClick={() => useAbility(card, index)} style={{ marginTop: "5px" }}>
                                Use Ability
                            </button>
                        )}

                        {/* Optional play match button for clarity (optional duplicate action) */}
                        <button onClick={() => playMatching(index)} style={{ marginTop: "5px" }}>
                            Play Match
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
