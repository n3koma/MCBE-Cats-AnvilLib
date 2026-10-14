import { Dimension, Entity, EntityQueryOptions, Vector3 } from "@minecraft/server";
/**
 * @remarks
 * 任意の太さ・長さ・向きの円柱範囲内にいるエンティティを取得する。
 */
export declare function getHitCylinderEntity(dimension: Dimension, origin: Vector3, direction: Vector3, radius: number, length: number, options?: Omit<EntityQueryOptions, "location" | "maxDistance">): Entity[];
