import { Container, Enchantment, EnchantmentType, EntityComponentTypes, ItemComponentTypes, ItemStack, Player, system } from "@minecraft/server";

export interface ItemData {
	typeId: string;
	amount: number;
	nameTag: string | undefined;
	lore: string[];
	enchantments: { typeId: string; level: number }[];
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

export function hasItem(player: Player, typeId: string, amount: number = 1): boolean {
		const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
		if (!container) return false;
		const hasItem = container.find(new ItemStack(typeId, amount));
		return hasItem !== undefined;
	}

export function hasItems(player: Player, items: { typeId: string; amount: number }[]): HasItemsResult[] {
		const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
		if (!container) return [];

		return items
			.map((item) => {
				const found = container.find(new ItemStack(item.typeId, item.amount));
				return found ? { ...item, slot: found } : undefined;
			})
			.filter((v): v is HasItemsResult => !!v);
	}


	/** 選択中のスロットに、指定typeIdのアイテムがあるか調べるよ */
export function getSelectedItem(player: Player, typeId: string): SelectedItemResult | undefined {
		const slot = player.selectedSlotIndex;
		const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
		if (!container) return undefined;

		const itemStack = container.getItem(slot);
		if (!itemStack || itemStack.typeId !== typeId) return undefined;

		return { container, slot, itemStack };
	}

	/** アイテムを指定数だけ消費するよ。0以下になったらスロットを空にする */
export function consumeItem(container: Container, slot: number, itemStack: ItemStack, amount: number = 1): void {
		if (amount <= 0) return;
		if (itemStack.amount > amount) {
			try {
				itemStack.amount -= amount;
				container.setItem(slot, itemStack);
			} catch {
				system.run(() => {
					itemStack.amount -= amount;
					container.setItem(slot, itemStack);
				});
			}
		} else {
			try {
				container.setItem(slot, undefined);
			} catch {
				system.run(() => container.setItem(slot, undefined));
			}
		}
	}

	/**
	 * アイテム使用処理を一括で扱うよ。
	 * 1. 選択中スロットにtypeIdが一致するアイテムがあるか確認
	 * 2. 追加条件(condition)をチェックして、成立したらその戻り値を保持
	 * 3. 条件成立時のみアイテムを消費して、戻り値を渡してonSuccessを発動
	 *
	 * conditionがfalsy(undefined/null/false)を返したら、何も起きずに終わるよ
	 */
export function useItem<T>(
		player: Player,
		typeId: string,
		consumeAmount: number,
		condition: () => T | undefined | null | false,
		onSuccess?: (value: T) => void,
		onFailure?: () => void
	): void {
		const selected = getSelectedItem(player, typeId);
		if (!selected) return;

		const result = condition();
		if (result) {
			consumeItem(selected.container, selected.slot, selected.itemStack, consumeAmount);
			onSuccess?.(result);
		} else {
			onFailure?.();
		}
	}

	// ────────────────────────────────────────────────────
	// アイテムシリアライズ・復元処理
	// ────────────────────────────────────────────────────

export const serializedDataPropertyId = "mclib:serialized_item_data";

	/** ItemStackの情報を丸ごと抽出する */
export function getSerializedItemData(itemStack: ItemStack): ItemData {
		const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable);
		const enchantments = (enchantable?.getEnchantments() ?? []).map((e) => ({
			typeId: e.type.id,
			level: e.level,
		}));

		const dynamicPropertyIds = itemStack.getDynamicPropertyIds();
		const dynamicProperties = dynamicPropertyIds.reduce(
			(acc, id) => ({ ...acc, [id]: itemStack.getDynamicProperty(id) }),
			{} as Record<string, any>
		);

		return {
			typeId: itemStack.typeId,
			amount: itemStack.amount,
			nameTag: itemStack.nameTag,
			lore: itemStack.getLore(),
			enchantments,
			canDestroy: itemStack.getCanDestroy(),
			canPlaceOn: itemStack.getCanPlaceOn(),
			damage: itemStack.getComponent(ItemComponentTypes.Durability)?.damage ?? 0,
			dynamicProperties,
		};
	}

	/** 封印アイテムにデータを埋め込む */
	export function embedSerializedItemData(itemStack: ItemStack, itemData: ItemData): void {
		itemStack.setDynamicProperty(serializedDataPropertyId, JSON.stringify(itemData));
	}

	/** 封印アイテムからデータを取り出す */
	export function extractSerializedItemData(itemStack: ItemStack): ItemData | undefined {
		const raw = itemStack.getDynamicProperty(serializedDataPropertyId);
		if (typeof raw !== "string") return undefined;
		return JSON.parse(raw) as ItemData;
	}

	/** 保存しておいたデータから、元のItemStackを完全復元する */
	export function restoreItemStack(itemData: ItemData): ItemStack {
		const restored = new ItemStack(itemData.typeId, itemData.amount);

		if (itemData.nameTag) restored.nameTag = itemData.nameTag;
		if (itemData.lore.length > 0) restored.setLore(itemData.lore);
		if (itemData.canDestroy.length > 0) restored.setCanDestroy(itemData.canDestroy);
		if (itemData.canPlaceOn.length > 0) restored.setCanPlaceOn(itemData.canPlaceOn);

		const enchantable = restored.getComponent(ItemComponentTypes.Enchantable);
		if (enchantable && itemData.enchantments.length > 0) {
			const enchants: Enchantment[] = itemData.enchantments.map((e) => ({
				type: new EnchantmentType(e.typeId),
				level: e.level,
			}));
			enchantable.addEnchantments(enchants);
		}

		const durability = restored.getComponent(ItemComponentTypes.Durability);
		if (durability && itemData.damage > 0) {
			durability.damage = itemData.damage;
		}

		for (const [key, value] of Object.entries(itemData.dynamicProperties)) {
			restored.setDynamicProperty(key, value);
		}

		return restored;
	}
