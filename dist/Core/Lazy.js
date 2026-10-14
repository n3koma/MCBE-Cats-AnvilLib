export function lazy(factory) {
    let cached;
    let initialized = false;
    const accessor = (() => {
        if (!initialized) {
            cached = factory();
            initialized = true;
        }
        return cached;
    });
    accessor.reset = () => {
        initialized = false;
        cached = undefined;
    };
    return accessor;
}
