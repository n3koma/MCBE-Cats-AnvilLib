import { Dimension, Player, Vector3, VectorXZ } from "@minecraft/server";
/**
 * チャンクの範囲情報を保持するクラス
 */
export interface Chunk {
    dimension: Dimension;
    from: VectorXZ;
    to: VectorXZ;
    chunkLocation: VectorXZ;
    toString(): string;
}
export declare function createChunk(dimension: Dimension, from: VectorXZ, to: VectorXZ): Chunk;
/**
 * 指定したワールド座標が属するチャンクの始点・終点を返す
 */
export declare function getChunk(dimension: Dimension, v: VectorXZ): Chunk;
export declare function showChunkBounds(player: Player, dimension: Dimension, location: Vector3, particleId?: string): Chunk;
/**
 * n×mチャンク分の範囲情報を保持するクラス
 */
export interface ChunkArea {
    dimension: Dimension;
    from: VectorXZ;
    to: VectorXZ;
    widthChunks: number;
    heightChunks: number;
    getChunks(): Chunk[];
    toString(): string;
}
export declare function createChunkArea(dimension: Dimension, origin: VectorXZ, widthChunks: number, heightChunks: number): ChunkArea;
/**
 * 指定座標を起点とした n×m チャンク範囲を取得する
 */
export declare function getChunkArea(dimension: Dimension, origin: VectorXZ, widthChunks: number, heightChunks: number): ChunkArea;
/**
 * 指定座標を中心とした n×m チャンク範囲を生成する
 * (widthChunks/heightChunksが偶数の場合は起点側に寄る)
 */
export declare function getChunkAreafromCenter(dimension: Dimension, center: VectorXZ, widthChunks: number, heightChunks: number): ChunkArea;
/**
 * n×mチャンク範囲の外周にパーティクルを表示する
 *
 * @param player       パーティクルの発生元として扱うプレイヤー
 * @param dimension    ディメンション
 * @param location     基準座標(y座標は表示高さに使用)
 * @param widthChunks  X方向のチャンク数
 * @param heightChunks Z方向のチャンク数
 * @param particleId   使用するパーティクルID
 */
export declare function showChunkAreaBounds(player: Player, dimension: Dimension, location: Vector3, widthChunks: number, heightChunks: number, particleId?: string): ChunkArea;
/**
 * 指定座標を中心とした n×m チャンク範囲の外周にパーティクルを表示する
 */
export declare function showChunkAreaBoundsFromCenter(player: Player, dimension: Dimension, center: Vector3, widthChunks: number, heightChunks: number, particleId?: string): ChunkArea;
