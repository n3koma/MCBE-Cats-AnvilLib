import { Dimension, Entity, EntityQueryOptions, Player, Vector3 } from "@minecraft/server";
export declare function isMonster(entity: Entity): boolean;
export declare function getAllEntity(queryOption?: EntityQueryOptions): Entity[];
export declare function filterPlayer(entities: Entity[]): Player[];
export declare function findSolidSurfaceLocation(dimension: Dimension, center: Vector3, minDistance: number, maxDistance: number, options?: {
    maxAttempts?: number;
    yScanRange?: number;
}): Vector3 | undefined;
