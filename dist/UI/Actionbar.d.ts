import { Player } from "@minecraft/server";
export declare function setActionbar(player: Player, id: string, text: string, options?: {
    duration?: number;
    separator?: string;
    priority?: number;
}): void;
export declare function clearActionbar(player: Player, id: string): void;
export declare function flushActionbar(player: Player): void;
