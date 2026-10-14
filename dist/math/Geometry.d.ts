import type { AABB, Vector3 } from "@minecraft/server";
export interface AABBMinMax {
    min: Vector3;
    max: Vector3;
}
export declare function getSpreadDirection(direction: Vector3, spreadDegree: number): Vector3;
export declare function aabbToMinMax(aabb: AABB): AABBMinMax;
export declare function closestPointInAABB(p: Vector3, box: AABBMinMax): Vector3;
export declare function closestPointOnSegment(p: Vector3, a: Vector3, b: Vector3): {
    point: Vector3;
    t: number;
};
export declare function segmentAABBDistance(a: Vector3, b: Vector3, box: AABBMinMax, iterations?: number): number;
