type Factory<T> = () => T;

export function lazy<T>(factory: Factory<T>): (Factory<T>) & { reset: () => void } {
	let cached: T | undefined;
	let initialized = false;

	const accessor = (() => {
		if (!initialized) {
			cached = factory();
			initialized = true;
		}
		return cached as T;
	}) as (Factory<T>) & { reset: () => void };

	accessor.reset = () => {
		initialized = false;
		cached = undefined;
	};

	return accessor;
}