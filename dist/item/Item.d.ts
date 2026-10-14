import { Container, ItemStack, Player } from "@minecraft/server";
interface SelectedItemResult {
    container: Container;
    slot: number;
    itemStack: ItemStack;
}
interface HasItemsResult {
    typeId: string;
    amount: number;
    slot: number;
}
export declare function hasItem(player: Player, typeId: string, amount?: number): boolean;
export declare function hasItems(player: Player, items: {
    typeId: string;
    amount: number;
}[]): HasItemsResult[];
export declare function getSelectedItem(player: Player, typeId: string): SelectedItemResult | undefined;
export declare function consumeItem(container: Container, slot: number, itemStack: ItemStack, amount?: number): void;
export declare function useItem<T>(player: Player, typeId: string, consumeAmount: number, condition: () => T | undefined | null | false, onSuccess?: (value: T) => void, onFailure?: () => void): void;
export {};
