import { Container, EntityComponentTypes, ItemStack, Player, system } from "@minecraft/server";

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

export function getSelectedItem(player: Player, typeId: string): SelectedItemResult | undefined {
	const slot = player.selectedSlotIndex;
	const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
	if (!container) return undefined;

	const itemStack = container.getItem(slot);
	if (!itemStack || itemStack.typeId !== typeId) return undefined;

	return { container, slot, itemStack };
}

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