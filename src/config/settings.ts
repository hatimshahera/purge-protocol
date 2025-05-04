// 📁 src/config/settings.ts
// Game configuration settings (turn times, player limits, etc)

export const GameSettings = {
    MAX_PLAYERS: 4,                  // Fixed to 4 players per game
    TURN_TIME_MIN_SECONDS: 30,      // Minimum allowed turn timer (host set)
    TURN_TIME_MAX_SECONDS: 180,     // Maximum allowed turn timer (host set)
    DEFAULT_TURN_TIME_SECONDS: 60,  // Default turn timer
    MIN_GAMES_PER_MATCH: 1,
    MAX_GAMES_PER_MATCH: 10,
    DEFAULT_GAMES_PER_MATCH: 4
};
