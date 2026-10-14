import { world } from "@minecraft/server";


const cache = new Map<string, boolean | number | string>();

export function getValue<T extends boolean | number | string>(id: string, defaultValue: T): T {
	const cached = cache.get(id);
	if (cached !== undefined) return cached as T;

	const stored = world.getDynamicProperty(id);
	if (typeof stored === typeof defaultValue) {
		cache.set(id, stored as T);
		return stored as T;
	}

	world.setDynamicProperty(id, defaultValue);
	cache.set(id, defaultValue);
	return defaultValue;
}

export function setValue<T extends boolean | number | string>(id: string, value: T): void {
	world.setDynamicProperty(id, value);
	cache.set(id, value);
}