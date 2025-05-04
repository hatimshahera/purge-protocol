// 📁 src/server/socket/index.ts
// Socket.IO server setup and connection handling (SAFE PATCHED VERSION)

import { Server } from "socket.io";
import { createServer } from "http";
import { registerRoomHandlers } from "./handlers/roomHandler";
import { registerGameHandlers } from "./handlers/gameHandler";
import { registerMatchHandlers } from "./handlers/matchHandler";

// Create HTTP server and Socket.IO server
const httpServer = createServer();
export const io = new Server(httpServer, {
    cors: {
        origin: "*", // Update with frontend origin later
    }
});

io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Register all game event handlers safely
    try {
        registerRoomHandlers(io, socket);
        registerGameHandlers(io, socket);
        registerMatchHandlers(io, socket);
    } catch (error) {
        console.error("Error registering handlers", error);
    }

    // Global disconnect handler (if needed additionally)
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Start HTTP server
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
});
