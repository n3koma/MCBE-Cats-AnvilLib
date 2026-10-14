import { Dimension, Entity, EntityComponentTypes, EntityQueryOptions, Player, Vector3, world } from "@minecraft/server";
import { Vec3 } from "../math";
import { DimensionEnum } from "../ids";

export function isMonster(entity: Entity): boolean {
	if (!entity?.isValid) return false;
	const typeFamily = entity.getComponent(EntityComponentTypes.TypeFamily);
	return typeFamily?.getTypeFamilies()?.includes("monster") === true;
}

export function getAllEntity(queryOption?: EntityQueryOptions): Entity[] {
	const entities = [];
	for (const dimensionId of Object.values(DimensionEnum)) {
		const dimension = world.getDimension(dimensionId);
		entities.push(...dimension.getEntities(queryOption));
	}
	return entities;
}

export function filterPlayer(entities: Entity[]): Player[] {
	return entities.filter((e): e is Player => e?.isValid && e instanceof Player);
}

export function findSolidSurfaceLocation(
	dimension: Dimension,
	center: Vector3,
	minDistance: number,
	maxDistance: number,
	options: {
		maxAttempts?: number;
		yScanRange?: number;
	} = {}
): Vector3 | undefined {
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
