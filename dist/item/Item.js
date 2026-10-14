import { EntityComponentTypes, ItemStack, system } from "@minecraft/server";
export function hasItem(player, typeId, amount = 1) {
    const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
    if (!container)
        return false;
    const hasItem = container.find(new ItemStack(typeId, amount));
    return hasItem !== undefined;
}
export function hasItems(player, items) {
    const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
    if (!container)
        return [];
    return items
        .map((item) => {
        const found = container.find(new ItemStack(item.typeId, item.amount));
        return found ? { ...item, slot: found } : undefined;
    })
        .filter((v) => !!v);
}
export function getSelectedItem(player, typeId) {
    const slot = player.selectedSlotIndex;
    const container = player.getComponent(EntityComponentTypes.Inventory)?.container;
    if (!container)
        return undefined;
    const itemStack = container.getItem(slot);
    if (!itemStack || itemStack.typeId !== typeId)
        return undefined;
    return { container, slot, itemStack };
}
export function consumeItem(container, slot, itemStack, amount = 1) {
    if (amount <= 0)
        return;
    if (itemStack.amount > amount) {
        try {
            itemStack.amount -= amount;
            container.setItem(slot, itemStack);
        }
        catch {
            system.run(() => {
                itemStack.amount -= amount;
                container.setItem(slot, itemStack);
            });
        }
    }
    else {
        try {
            container.setItem(slot, undefined);
        }
        catch {
            system.run(() => container.setItem(slot, undefined));
        }
    }
}
export function useItem(player, typeId, consumeAmount, condition, onSuccess, onFailure) {
    const selected = getSelectedItem(player, typeId);
    if (!selected)
        return;
    const result = condition();
    if (result) {
        consumeItem(selected.container, selected.slot, selected.itemStack, consumeAmount);
        onSuccess?.(result);
    }
    else {
        onFailure?.();
    }
}
