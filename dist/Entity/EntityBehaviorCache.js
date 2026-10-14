// Lib/EntityCacheRegistry.ts
import { world } from "@minecraft/server";
import * as Debug from "../Core/Debug";
function createEntityTypeCache(typeId) {
    return { typeId, cache: new Map() };
}
/** 初期化：ワールド起動時に一度だけ全探索してキャッシュを埋める */
function initializeCache(cache) {
    for (const dimension of ["overworld", "nether", "the_end"]) {
        const entities = world.getDimension(dimension).getEntities({ type: cache.typeId });
        for (const entity of entities) {
            cache.cache.set(entity.id, entity);
        }
    }
}
function addToCache(cache, entity) {
    if (entity.typeId !== cache.typeId)
        return;
    cache.cache.set(entity.id, entity);
}
function removeFromCache(cache, entityId) {
    cache.cache.delete(entityId);
}
function getCachedEntities(cache) {
    const result = [];
    for (const [id, entity] of cache.cache) {
        if (!entity.isValid) {
            cache.cache.delete(id);
            continue;
        }
        result.push(entity);
    }
    return result;
}
const caches = new Map();
let eventsRegistered = false;
let worldInitialized = false;
/**
 * 特定のtypeIdをキャッシュ対象として登録する。
 * 既にワールドが初期化済みなら即座にそのタイプも初期スキャンする。
 */
export function registerBehaviorCache(typeId) {
    if (caches.has(typeId))
        return;
    const cache = createEntityTypeCache(typeId);
    caches.set(typeId, cache);
    ensureEventsRegistered();
    if (worldInitialized) {
        initializeCache(cache);
    }
}
/** ワールド起動後に一度だけ呼ぶ。登録済みの全タイプを初期スキャンする */
export function initializeBehaviorCache() {
    if (worldInitialized)
        return;
    worldInitialized = true;
    for (const cache of caches.values()) {
        initializeCache(cache);
    }
}
export function getBehaviorCache(typeId) {
    const cache = caches.get(typeId);
    if (!cache) {
        Debug.log(`EntityCacheRegistry: typeId "${typeId}" is not registered.`);
        return [];
    }
    return getCachedEntities(cache);
}
function ensureEventsRegistered() {
    if (eventsRegistered)
        return;
    eventsRegistered = true;
    world.afterEvents.entitySpawn.subscribe(({ entity }) => {
        caches.get(entity.typeId) && addToCache(caches.get(entity.typeId), entity);
    });
    world.afterEvents.entityDie.subscribe(({ deadEntity }) => {
        const cache = caches.get(deadEntity.typeId);
        if (cache)
            removeFromCache(cache, deadEntity.id);
    });
    world.afterEvents.entityRemove.subscribe(({ removedEntityId, typeId }) => {
        const cache = caches.get(typeId);
        if (cache)
            removeFromCache(cache, removedEntityId);
    });
}
world.afterEvents.worldLoad.subscribe(() => initializeBehaviorCache());
