type Factory<T> = () => T;
export declare function lazy<T>(factory: Factory<T>): (Factory<T>) & {
    reset: () => void;
};
export {};
