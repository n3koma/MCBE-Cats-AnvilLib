import { world } from "@minecraft/server";
const cache = new Map();
export function getValue(id, defaultValue) {
    const cached = cache.get(id);
    if (cached !== undefined)
        return cached;
    const stored = world.getDynamicProperty(id);
    if (typeof stored === typeof defaultValue) {
        cache.set(id, stored);
        return stored;
    }
    world.setDynamicProperty(id, defaultValue);
    cache.set(id, defaultValue);
    return defaultValue;
}
export function setValue(id, value) {
    world.setDynamicProperty(id, value);
    cache.set(id, value);
}
