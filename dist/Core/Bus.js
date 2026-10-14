function isCancelable(event) {
    return typeof event === "object" && event !== null && "cancel" in event;
}
// ── イベントバス ────────────────────────────────────
export class EventBus {
    constructor() {
        this.handlers = [];
    }
    register(id, fn, priority = 100) {
        this.handlers = this.handlers.filter(h => h.id !== id);
        this.handlers.push({ id, fn, priority });
        this.handlers.sort((a, b) => a.priority - b.priority);
    }
    unregister(id) {
        this.handlers = this.handlers.filter(h => h.id !== id);
    }
    dispatch(event) {
        for (const handler of this.handlers) {
            handler.fn(event);
            if (isCancelable(event) && event.cancel)
                break;
        }
    }
}
// ── ティックバス ────────────────────────────────────
export class TickBusImpl {
    constructor() {
        this.handlers = [];
    }
    register(id, fn, priority = 100) {
        this.handlers = this.handlers.filter(h => h.id !== id);
        this.handlers.push({ id, fn, priority });
        this.handlers.sort((a, b) => a.priority - b.priority);
    }
    unregister(id) {
        this.handlers = this.handlers.filter(h => h.id !== id);
    }
    dispatch(ctx) {
        for (const handler of this.handlers) {
            handler.fn(ctx);
        }
    }
}
// ── プレイヤーごとティックバス ──────────────────────────────
export class TickPlayerBusImpl {
    constructor() {
        this.handlers = [];
    }
    register(id, fn, priority = 100) {
        this.handlers = this.handlers.filter(h => h.id !== id);
        this.handlers.push({ id, fn, priority });
        this.handlers.sort((a, b) => a.priority - b.priority);
    }
    unregister(id) {
        this.handlers = this.handlers.filter(h => h.id !== id);
    }
    dispatch(ctx) {
        for (const handler of this.handlers) {
            handler.fn(ctx);
        }
    }
}
