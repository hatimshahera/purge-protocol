// 📁 client/src/components/Card.tsx
// Card component → used for PlayerHand + MiddleCard

import React from "react";
import { Card as CardType } from "../hooks/useGame";

export default function Card({ card, onClick }: { card: CardType; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            style={{
                border: "2px solid black",
                borderRadius: "8px",
                width: "100px",
                height: "140px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                cursor: onClick ? "pointer" : "default",
                transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
            }}
        >
            <h3>{card.value}</h3>
            <p>{card.ability ?? "Normal"}</p>
        </div>
    );
}
