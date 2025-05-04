// 📁 src/server/socket/roomStore.ts

import { Room } from "../models/room";
import { GameEngine } from "../game/engine";
import { Match } from "../models/match";

export const rooms: Map<string, { room: Room; engine?: GameEngine; match?: Match; timer?: any }> = new Map();
