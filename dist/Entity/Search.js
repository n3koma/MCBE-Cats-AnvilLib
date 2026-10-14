import { aabbToMinMax, segmentAABBDistance, Vec3 } from "../math";
/**
 * @remarks
 * 任意の太さ・長さ・向きの円柱範囲内にいるエンティティを取得する。
 */
export function getHitCylinderEntity(dimension, origin, direction, radius, length, options) {
    const axis = Vec3.normalize(direction);
    const endPoint = Vec3.add(origin, Vec3.scale(axis, length));
    const halfPoint = Vec3.add(origin, Vec3.scale(axis, length * 0.5));
    const candidates = dimension.getEntities({ ...options, location: halfPoint, maxDistance: length * 0.6 + radius });
    const result = [];
    for (const entity of candidates) {
        const dist = segmentAABBDistance(origin, endPoint, aabbToMinMax(entity.getAABB()));
        if (dist <= radius) {
            result.push(entity);
        }
    }
    return result;
}
