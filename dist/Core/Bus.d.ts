import type { Player } from "@minecraft/server";
type HandlerFn<T> = (event: T) => void;
export declare class EventBus<T extends object> {
    private handlers;
    register(id: string, fn: HandlerFn<T>, priority?: number): void;
    unregister(id: string): void;
    dispatch(event: T): void;
}
export interface TickContext {
    currentTick: number;
}
export interface TickPlayerContext extends TickContext {
    player: Player;
}
export declare class TickBusImpl {
    private handlers;
    register(id: string, fn: (ctx: TickContext) => void, priority?: number): void;
    unregister(id: string): void;
    dispatch(ctx: TickContext): void;
}
export declare class TickPlayerBusImpl {
    private handlers;
    register(id: string, fn: (ctx: TickPlayerContext) => void, priority?: number): void;
    unregister(id: string): void;
    dispatch(ctx: TickPlayerContext): void;
}
export {};
