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
export declare function ceilMultiple(value: number, multiple: number): number;
export declare function randomPick<T>(array: T[]): T | undefined;
export {};
