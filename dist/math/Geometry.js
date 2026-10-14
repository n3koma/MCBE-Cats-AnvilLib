import { Vec3 } from "./Vector";
import { clamp } from "./Mathm";
export function getSpreadDirection(direction, spreadDegree) {
    const base = Vec3.normalize(direction);
    const upHint = Math.abs(base.y) < 0.99 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
    const right = Vec3.normalize(Vec3.cross(upHint, base));
    const up = Vec3.normalize(Vec3.cross(base, right));
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * spreadDegree;
    const offset = Vec3.add(Vec3.scale(right, Math.cos(angle) * radius), Vec3.scale(up, Math.sin(angle) * radius));
    return Vec3.normalize(Vec3.add(base, offset));
}
export function aabbToMinMax(aabb) {
    const half = Vec3.scale(aabb.extent, 0.5);
    return {
        min: Vec3.subtract(aabb.center, half),
        max: Vec3.add(aabb.center, half),
    };
}
export function closestPointInAABB(p, box) {
    return {
        x: clamp(p.x, box.min.x, box.max.x),
        y: clamp(p.y, box.min.y, box.max.y),
        z: clamp(p.z, box.min.z, box.max.z),
    };
}
export function closestPointOnSegment(p, a, b) {
    const ab = Vec3.subtract(b, a);
    const abLenSq = Vec3.dot(ab, ab) || 1;
    const t = clamp(Vec3.dot(Vec3.subtract(p, a), ab) / abLenSq, 0, 1);
    return { point: Vec3.add(a, Vec3.scale(ab, t)), t };
}
export function segmentAABBDistance(a, b, box, iterations = 4) {
    let p = Vec3.scale(Vec3.add(a, b), 0.5); // 初期値: 線分の中点
    for (let i = 0; i < iterations; i++) {
        const q = closestPointInAABB(p, box);
        p = closestPointOnSegment(q, a, b).point;
    }
    const q = closestPointInAABB(p, box);
    return Vec3.len(Vec3.subtract(p, q));
}
