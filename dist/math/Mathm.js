export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
export function clamp01(value) {
    return clamp(value, 0, 1);
}
export function lerp(a, b, t) {
    return a + (b - a) * clamp01(t);
}
export function randomInt(min, max) {
    if (min > max)
        throw new Error(`min must be <= max, but got min=${min}, max=${max}`);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomPick(array) {
    if (array.length === 0)
        return undefined;
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}
export class WeightedArray {
    constructor(items) {
        this.items = items;
        if (items.some(({ weight }) => weight < 0 || !Number.isFinite(weight))) {
            throw new Error("weight must be a non-negative finite number");
        }
        this.totalWeight = items.reduce((sum, { weight }) => sum + weight, 0);
    }
    pick() {
        if (this.items.length === 0 || this.totalWeight <= 0)
            return undefined;
        let random = Math.random() * this.totalWeight;
        for (const { item, weight } of this.items) {
            random -= weight;
            if (random < 0)
                return item;
        }
        return this.items[this.items.length - 1].item;
    }
}
