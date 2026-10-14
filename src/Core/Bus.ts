import { Player } from "@minecraft/server";

// ────────────────────────────────────────────────────
// イベントハンドラ定義
// ────────────────────────────────────────────────────

type HandlerFn<T> = (event: T) => void;

interface RegisteredHandler<T> {
	id: string;
	fn: HandlerFn<T>;
	priority: number;
}

interface Cancelable {
	cancel?: boolean;
}

function isCancelable(event: unknown): event is Cancelable {
	return typeof event === "object" && event !== null && "cancel" in event;
}

// ── イベントバス ────────────────────────────────────
export class EventBus<T extends object> {
	private handlers: RegisteredHandler<T>[] = [];

	register(id: string, fn: HandlerFn<T>, priority = 100): void {
		this.handlers = this.handlers.filter(h => h.id !== id);
		this.handlers.push({ id, fn, priority });
		this.handlers.sort((a, b) => a.priority - b.priority);
	}

	unregister(id: string): void {
		this.handlers = this.handlers.filter(h => h.id !== id);
	}

	dispatch(event: T): void {
		for (const handler of this.handlers) {
			handler.fn(event);
			if (isCancelable(event) && event.cancel) break;
		}
	}
}

// ────────────────────────────────────────────────────
// ティックハンドラ定義
// ────────────────────────────────────────────────────
export interface TickContext {
	currentTick: number;
}

export interface TickPlayerContext extends TickContext {
	player: Player;
}

interface RegisteredTickHandler {
	id: string;
	fn: (ctx: TickContext) => void;
	priority: number;
}

interface RegisteredTickPlayerHandler {
	id: string;
	fn: (ctx: TickPlayerContext) => void;
	priority: number;
}

// ── ティックバス ────────────────────────────────────
export class TickBusImpl {
	private handlers: RegisteredTickHandler[] = [];

	register(id: string, fn: (ctx: TickContext) => void, priority = 100): void {
		this.handlers = this.handlers.filter(h => h.id !== id);
		this.handlers.push({ id, fn, priority });
		this.handlers.sort((a, b) => a.priority - b.priority);
	}

	unregister(id: string): void {
		this.handlers = this.handlers.filter(h => h.id !== id);
	}

	dispatch(ctx: TickContext): void {
		for (const handler of this.handlers) {
			handler.fn(ctx);
		}
	}
}

// ── プレイヤーごとティックバス ──────────────────────────────
export class TickPlayerBusImpl {
	private handlers: RegisteredTickPlayerHandler[] = [];

	register(id: string, fn: (ctx: TickPlayerContext) => void, priority = 100): void {
		this.handlers = this.handlers.filter(h => h.id !== id);
		this.handlers.push({ id, fn, priority });
		this.handlers.sort((a, b) => a.priority - b.priority);
	}

	unregister(id: string): void {
		this.handlers = this.handlers.filter(h => h.id !== id);
	}

	dispatch(ctx: TickPlayerContext): void {
		for (const handler of this.handlers) {
			handler.fn(ctx);
		}
	}
}
