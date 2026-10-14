import { Dimension, Entity, EntityQueryOptions, Player, Vector3 } from "@minecraft/server";
/**
 * 対象エンティティが敵かどうかを判定する
 */
export declare function isEnemy(entity: Entity): boolean;
/**
 * owner が敵(isEnemy===true)なら「敵じゃない相手」だけを対象にする
 * owner が敵じゃない(isEnemy===false)なら「敵」だけを対象にする
 */
export declare function isValidTarget(owner: Entity, target: Entity): boolean;
export declare function getAllEntity(queryOption?: EntityQueryOptions): Entity[];
export declare function filterPlayer(entities: Entity[]): Player[];
export declare function findRandomSpawnLocation(dimension: Dimension, center: Vector3, minDistance: number, maxDistance: number, options?: {
    maxAttempts?: number;
    /** getTopmostBlock の探索上限。center.y からの相対値 */
    yScanRange?: number;
}): Vector3 | undefined;
