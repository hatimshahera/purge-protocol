// 📁 src/server/utils/timer.ts
// Utility for managing player turn timers

export class TurnTimer {
    private timerId: NodeJS.Timeout | null = null;
    private duration: number;
    private onTimeout: () => void;

    constructor(durationInSeconds: number, onTimeout: () => void) {
        this.duration = durationInSeconds * 1000; // convert to milliseconds
        this.onTimeout = onTimeout;
    }

    /**
     * Start the timer
     */
    start() {
        this.clear();
        this.timerId = setTimeout(() => {
            this.onTimeout();
        }, this.duration);
    }

    /**
     * Clear the timer if running
     */
    clear() {
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    }

    /**
     * Reset and start timer again
     */
    reset() {
        this.start();
    }
}
