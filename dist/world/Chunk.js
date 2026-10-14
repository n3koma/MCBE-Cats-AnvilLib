import { VecXZ } from "../math/Vector";
/**
 * チャンクの範囲情報を保持するクラス
 */
export class Chunk {
    constructor(dimension, from, to) {
        this.dimension = dimension;
        this.from = from;
        this.to = to;
    }
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
    constructor(dimension, fromChunk, toChunk) {
        this.dimension = dimension;
        this.fromChunk = fromChunk;
        this.toChunk = toChunk;
    }
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
export function getChunk(dimension, v) {
    const startX = Math.floor(v.x / 16) * 16;
    const startZ = Math.floor(v.z / 16) * 16;
    const endX = startX + 15;
    const endZ = startZ + 15;
    return new Chunk(dimension, VecXZ.create({ x: startX, z: startZ }), VecXZ.create({ x: endX, z: endZ }));
}
export function createChunkArea(dimension, origin, xChunk, zChunk) {
    const startX = Math.floor(origin.x / 16) * 16;
    const startZ = Math.floor(origin.z / 16) * 16;
    const endX = startX + xChunk * 16 - 1;
    const endZ = startZ + zChunk * 16 - 1;
    const from = VecXZ.create({ x: startX, z: startZ });
    const to = VecXZ.create({ x: endX, z: endZ });
    return new ChunkArea(dimension, getChunk(dimension, from), getChunk(dimension, to));
}
export function getChunkArea(dimension, origin, xChunk, zChunk) {
    return createChunkArea(dimension, origin, xChunk, zChunk);
}
export function getChunkAreafromCenter(dimension, center, xChunk, zChunk) {
    const centerChunkX = Math.floor(center.x / 16);
    const centerChunkZ = Math.floor(center.z / 16);
    const originChunkX = centerChunkX - Math.floor((xChunk - 1) / 2);
    const originChunkZ = centerChunkZ - Math.floor((zChunk - 1) / 2);
    return createChunkArea(dimension, VecXZ.create({ x: originChunkX * 16, z: originChunkZ * 16 }), xChunk, zChunk);
}
