import { Container, ItemStack, Player } from "@minecraft/server";
export interface ItemData {
    typeId: string;
    amount: number;
    nameTag: string | undefined;
    lore: string[];
    enchantments: {
        typeId: string;
        level: number;
    }[];
    canDestroy: string[];
    canPlaceOn: string[];
    damage: number;
    dynamicProperties: Record<string, any>;
}
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
/** 選択中のスロットに、指定typeIdのアイテムがあるか調べるよ */
export declare function getSelectedItem(player: Player, typeId: string): SelectedItemResult | undefined;
/** アイテムを指定数だけ消費するよ。0以下になったらスロットを空にする */
export declare function consumeItem(container: Container, slot: number, itemStack: ItemStack, amount?: number): void;
/**
 * アイテム使用処理を一括で扱うよ。
 * 1. 選択中スロットにtypeIdが一致するアイテムがあるか確認
 * 2. 追加条件(condition)をチェックして、成立したらその戻り値を保持
 * 3. 条件成立時のみアイテムを消費して、戻り値を渡してonSuccessを発動
 *
 * conditionがfalsy(undefined/null/false)を返したら、何も起きずに終わるよ
 */
export declare function useItem<T>(player: Player, typeId: string, consumeAmount: number, condition: () => T | undefined | null | false, onSuccess?: (value: T) => void, onFailure?: () => void): void;
export declare const serializedDataPropertyId = "mclib:serialized_item_data";
/** ItemStackの情報を丸ごと抽出する */
export declare function getSerializedItemData(itemStack: ItemStack): ItemData;
/** 封印アイテムにデータを埋め込む */
export declare function embedSerializedItemData(itemStack: ItemStack, itemData: ItemData): void;
/** 封印アイテムからデータを取り出す */
export declare function extractSerializedItemData(itemStack: ItemStack): ItemData | undefined;
/** 保存しておいたデータから、元のItemStackを完全復元する */
export declare function restoreItemStack(itemData: ItemData): ItemStack;
export {};
