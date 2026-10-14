import type { Dimension, VectorXZ } from "@minecraft/server";
/**
 * チャンクの範囲情報を保持するクラス
 */
export declare class Chunk {
    dimension: Dimension;
    from: VectorXZ;
    to: VectorXZ;
    constructor(dimension: Dimension, from: VectorXZ, to: VectorXZ);
    toString(): string;
    toJSON(): {
        dimension: string;
        from: {
            x: number;
            z: number;
        };
        to: {
            x: number;
            z: number;
        };
    };
}
/**
 * n×mチャンク分の範囲情報を保持するクラス
 */
export declare class ChunkArea {
    dimension: Dimension;
    fromChunk: Chunk;
    toChunk: Chunk;
    constructor(dimension: Dimension, fromChunk: Chunk, toChunk: Chunk);
    toString(): string;
    toJSON(): {
        dimension: string;
        fromChunk: {
            dimension: string;
            from: {
                x: number;
                z: number;
            };
            to: {
                x: number;
                z: number;
            };
        };
        toChunk: {
            dimension: string;
            from: {
                x: number;
                z: number;
            };
            to: {
                x: number;
                z: number;
            };
        };
    };
}
export declare function getChunk(dimension: Dimension, v: VectorXZ): Chunk;
export declare function createChunkArea(dimension: Dimension, origin: VectorXZ, xChunk: number, zChunk: number): ChunkArea;
export declare function getChunkArea(dimension: Dimension, origin: VectorXZ, xChunk: number, zChunk: number): ChunkArea;
export declare function getChunkAreafromCenter(dimension: Dimension, center: VectorXZ, xChunk: number, zChunk: number): ChunkArea;
