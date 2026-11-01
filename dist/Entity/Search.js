import { aabbToMinMax, segmentAABBDistance, Vec3 } from "../math";
/**
 * @remarks
 * 任意の太さ・長さ・向きの円柱範囲内にいるエンティティを取得する。
 */
export function getHitCylinderEntity(dimension, origin, direction, radius, length, options) {
    const axis = Vec3.normalize(direction);
    const endPoint = Vec3.add(origin, Vec3.scale(axis, length));
    const halfPoint = Vec3.add(origin, Vec3.scale(axis, length * 0.5));
    const candidates = dimension.getEntities({
        ...options,
        location: halfPoint,
        maxDistance: length * 0.6 + radius,
    });
    const result = [];
    for (const entity of candidates) {
        const { min, max } = aabbToMinMax(entity.getAABB());
        // AABB を軸方向に射影して [tMin, tMax] を求める
        const center = {
            x: (min.x + max.x) * 0.5,
            y: (min.y + max.y) * 0.5,
            z: (min.z + max.z) * 0.5,
        };
        const half = {
            x: (max.x - min.x) * 0.5,
            y: (max.y - min.y) * 0.5,
            z: (max.z - min.z) * 0.5,
        };
        const t = Vec3.dot(Vec3.subtract(center, origin), axis);
        const extentAlongAxis = Math.abs(axis.x) * half.x + Math.abs(axis.y) * half.y + Math.abs(axis.z) * half.z;
        // 発射地点より後ろ、または終点より先なら除外
        if (t + extentAlongAxis < 0 || t - extentAlongAxis > length)
            continue;
        const dist = segmentAABBDistance(origin, endPoint, { min, max });
        if (dist <= radius) {
            result.push(entity);
        }
    }
    return result;
}
