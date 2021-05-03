interface CacheOptions {
    size: number;
    assoc: number;
    algorithm: "lru" | "mru" | "lfu" | "mfu";
    serialize?: (data: any) => any;
}
declare class Cache<K, V> {
    constructor(options: CacheOptions);
    put(key: K, data: V): void;
    get(key: K): V;
    del(key: K): void;
    clear(): void;
}
export = Cache;
