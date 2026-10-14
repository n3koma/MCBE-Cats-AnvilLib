import { EntityComponentTypes, Player, world } from "@minecraft/server";
import { Vec3 } from "../math";
import { DimensionEnum } from "../ids";
export function isMonster(entity) {
    if (!entity?.isValid)
        return false;
    const typeFamily = entity.getComponent(EntityComponentTypes.TypeFamily);
    return typeFamily?.getTypeFamilies()?.includes("monster") === true;
}
export function getAllEntity(queryOption) {
    const entities = [];
    for (const dimensionId of Object.values(DimensionEnum)) {
        const dimension = world.getDimension(dimensionId);
        entities.push(...dimension.getEntities(queryOption));
    }
    return entities;
}
export function filterPlayer(entities) {
    return entities.filter((e) => e?.isValid && e instanceof Player);
}
export function findSolidSurfaceLocation(dimension, center, minDistance, maxDistance, options = {}) {
    const { maxAttempts = 16, yScanRange = 6 } = options;
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (maxDistance - minDistance) + minDistance;
        const candidate = Vec3.add(center, {
            x: Math.cos(angle) * dist,
            y: Math.random() * yScanRange, // ランダムに高さをずらす
            z: Math.sin(angle) * dist,
        });
        const topmostBlock = dimension.getTopmostBlock(candidate, center.y + yScanRange);
        if (topmostBlock?.isSolid && dimension.isChunkLoaded(topmostBlock)) {
            return Vec3.create({ x: topmostBlock.x, y: topmostBlock.y + 1, z: topmostBlock.z });
        }
    }
    return undefined;
}
