// 📁 client/src/api/socket.ts

import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "../types/socketEvents";

const URL = "http://localhost:3000"; // Update if backend hosted elsewhere

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(URL, {
    autoConnect: false, // We will connect manually when player joins room
});

// Helper to connect
export function connectSocket() {
    if (!socket.connected) {
        socket.connect();
    }
}

// Helper to disconnect (if needed)
export function disconnectSocket() {
    if (socket.connected) {
        socket.disconnect();
    }
}
