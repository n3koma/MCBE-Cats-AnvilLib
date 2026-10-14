interface WeightedItem<T> {
	item: T;
	weight: number;
}

export class WeightedArray<T> {
	private totalWeight: number;

	constructor(
		private items: WeightedItem<T>[]
	) {
    if (items.some(({ weight }) => weight < 0 || !Number.isFinite(weight))) {
			throw new Error("weight must be a non-negative finite number");
    }
		this.totalWeight = items.reduce((sum, { weight }) => sum + weight, 0);
	}

	pick(): T | undefined {
		if (this.items.length === 0 || this.totalWeight <= 0) return undefined;
		let random = Math.random() * this.totalWeight;
		for (const { item, weight } of this.items) {
			random -= weight;
			if (random < 0) return item;
		}
		return this.items[this.items.length - 1].item;
	}
}

export function ceilMultiple(value: number, multiple: number): number {
	return multiple * (Math.floor(value / multiple) + 1);
}

export function randomPick<T>(array: T[]): T | undefined {
	if (array.length === 0) return undefined;
	const index = Math.floor(Math.random() * array.length);
	return array[index];
}