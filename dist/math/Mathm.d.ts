export declare function clamp(value: number, min: number, max: number): number;
export declare function clamp01(value: number): number;
export declare function lerp(a: number, b: number, t: number): number;
export declare function randomInt(min: number, max: number): number;
export declare function randomPick<T>(array: T[]): T | undefined;
interface WeightedItem<T> {
    item: T;
    weight: number;
}
export declare class WeightedArray<T> {
    private items;
    private totalWeight;
    constructor(items: WeightedItem<T>[]);
    pick(): T | undefined;
}
export {};
