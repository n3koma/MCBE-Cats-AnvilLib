import type { Dimension, VectorXZ } from "@minecraft/server";
import { VecXZ } from "../math/Vector";

/**
 * チャンクの範囲情報を保持するクラス
 */
export class Chunk {
	constructor(
		public dimension: Dimension,
		public from: VectorXZ,
		public to: VectorXZ
	) {}

	toString() {
		return `start:[${this.from.x},${this.from.z}],end:[${this.to.x},${this.to.z}]`;
	}

	toJSON() {
		return {
			dimension: this.dimension.id,
			from: { x: this.from.x, z: this.from.z },
			to: { x: this.to.x, z: this.to.z }
		};
	}
}

/**
 * n×mチャンク分の範囲情報を保持するクラス
 */
export class ChunkArea {
	constructor(
		public dimension: Dimension,
		public fromChunk: Chunk,
		public toChunk: Chunk,
	) {}

	toString() {
		return `fromChunk:[${this.fromChunk.from.x},${this.fromChunk.from.z}],toChunk:[${this.toChunk.to.x},${this.toChunk.to.z}]`;
	}

	toJSON() {
		return {
			dimension: this.dimension.id,
			fromChunk: this.fromChunk.toJSON(),
			toChunk: this.toChunk.toJSON()
		};
	}
}

export function getChunk(
	dimension: Dimension,
	v: VectorXZ
): Chunk {
	const startX: number = Math.floor(v.x / 16) * 16;
	const startZ: number = Math.floor(v.z / 16) * 16;
	const endX: number = startX + 15;
	const endZ: number = startZ + 15;

	return new Chunk(
		dimension,
		VecXZ.create({ x: startX, z: startZ }),
		VecXZ.create({ x: endX, z: endZ })
	);
}

export function createChunkArea(
	dimension: Dimension,
	origin: VectorXZ,
	xChunk: number, 
	zChunk: number
): ChunkArea {
	const startX: number = Math.floor(origin.x / 16) * 16;
	const startZ: number = Math.floor(origin.z / 16) * 16;
	const endX: number = startX + xChunk * 16 - 1;
	const endZ: number = startZ + zChunk * 16 - 1;

	const from = VecXZ.create({ x: startX, z: startZ });
	const to = VecXZ.create({ x: endX, z: endZ });

	return new ChunkArea(
		dimension,
		getChunk(dimension, from),
		getChunk(dimension, to)
	);
}

export function getChunkArea(
	dimension: Dimension,
	origin: VectorXZ,
	xChunk: number,
	zChunk: number
): ChunkArea {
	return createChunkArea(dimension, origin, xChunk, zChunk);
}

export function getChunkAreafromCenter(
	dimension: Dimension,
	center: VectorXZ,
	xChunk: number,
	zChunk: number
): ChunkArea {
	const centerChunkX = Math.floor(center.x / 16);
	const centerChunkZ = Math.floor(center.z / 16);

	const originChunkX = centerChunkX - Math.floor((xChunk - 1) / 2);
	const originChunkZ = centerChunkZ - Math.floor((zChunk - 1) / 2);

	return createChunkArea(
		dimension,
		VecXZ.create({ x: originChunkX * 16, z: originChunkZ * 16 }),
		xChunk,
		zChunk
	);
}