// 📁 client/src/types/socketEvents.ts
// Define all socket events and payload types

export type ServerToClientEvents = {
    room_update: (players: { id: string; name: string }[]) => void;
    player_ready: (playerId: string) => void;
    game_started: (data: { players: { id: string; name: string }[]; firstPlayerId: string; deckSize: number }) => void;
    start_turns: (data: { roomId: string }) => void;
    next_player: (playerId: string) => void;
    your_turn: () => void; // ✅ ADDED THIS
    middle_card_updated: (card: any) => void;
    card_drawn: (card: any) => void;
    play_result: (success: boolean) => void;
    player_action: (action: any) => void;
    purge_called: (playerId: string) => void;
    game_ended: (data: any) => void;
    match_ended: (data: any) => void;
};


export type ClientToServerEvents = {
    join_room: (data: { roomId: string; playerName: string }) => void;
    ready: (data: { roomId: string }) => void;
    draw_card: (data: { roomId: string }) => void;
    swap_or_drop: (data: { roomId: string; handIndex: number | null; drawnCard: any }) => void;
    play_matching_card: (data: { roomId: string; handIndex: number }) => void;
    use_ability: (data: { roomId: string; card: any; targetPlayerId?: string; handIndex?: number }) => void;
    call_purge: (data: { roomId: string }) => void;
    end_turn: (data: { roomId: string }) => void;
    start_turns: (data: { roomId: string }) => void;
};
