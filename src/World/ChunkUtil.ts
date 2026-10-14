import { Dimension, MolangVariableMap, Player, Vector3, VectorXZ } from "@minecraft/server";
import * as Particle from "./ParticleUtil";
import { VecXZ } from "../Core/VectorUtil";

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

export function createChunk(dimension: Dimension, from: VectorXZ, to: VectorXZ): Chunk {
  return {
    dimension,
    from,
    to,
    get chunkLocation() { return VecXZ.create({ x: from.x / 16, z: from.z / 16 }); },
    toString() { return `start:[${from.x},${from.z}],end:[${to.x},${to.z}]`; },
  };
}

/**
 * チャンク関連のユーティリティ
 */
const DEFAULT_PARTICLE_ID = "minecraft:endrod";
const CHUNK_STEP = 2;

  /**
   * 指定したワールド座標が属するチャンクの始点・終点を返す
   */
export function getChunk(dimension: Dimension, v: VectorXZ): Chunk {
    const startX: number = Math.floor(v.x / 16) * 16;
    const startZ: number = Math.floor(v.z / 16) * 16;
    const endX: number = startX + 15;
    const endZ: number = startZ + 15;

    return createChunk(
      dimension,
      VecXZ.create({ x: startX, z: startZ }),
      VecXZ.create({ x: endX, z: endZ })
    );
  }

export function showChunkBounds(
		player: Player,
    dimension: Dimension,
    location: Vector3,
    particleId: string = DEFAULT_PARTICLE_ID
  ): Chunk {
    const chunk: Chunk = getChunk(dimension, location);
		
		const molang = new MolangVariableMap();
		molang.setFloat("width", 0.02);

    for (let x = chunk.from.x; x <= chunk.to.x + 1; x += CHUNK_STEP) {
      Particle.spawnAsPlayer(player, particleId, dimension, { x, y: location.y, z: chunk.from.z }, molang);
      Particle.spawnAsPlayer(player, particleId, dimension, { x, y: location.y, z: chunk.to.z + 1 }, molang);
		}

    for (let z = chunk.from.z; z <= chunk.to.z + 1; z += CHUNK_STEP) {
      Particle.spawnAsPlayer(player, particleId, dimension, { x: chunk.from.x, y: location.y, z }, molang);
      Particle.spawnAsPlayer(player, particleId, dimension, { x: chunk.to.x + 1, y: location.y, z }, molang);
		}

    return chunk;
  }

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

export function createChunkArea(dimension: Dimension, origin: VectorXZ, widthChunks: number, heightChunks: number): ChunkArea {
    const startX: number = Math.floor(origin.x / 16) * 16;
    const startZ: number = Math.floor(origin.z / 16) * 16;
    const endX: number = startX + widthChunks * 16 - 1;
    const endZ: number = startZ + heightChunks * 16 - 1;

    const from = VecXZ.create({ x: startX, z: startZ });
    const to = VecXZ.create({ x: endX, z: endZ });
    return {
      dimension,
      from,
      to,
      widthChunks,
      heightChunks,
      getChunks(): Chunk[] {
    const chunks: Chunk[] = [];

    for (let cz = 0; cz < this.heightChunks; cz++) {
      for (let cx = 0; cx < this.widthChunks; cx++) {
        const startX = this.from.x + cx * 16;
        const startZ = this.from.z + cz * 16;

        chunks.push(
          createChunk(
            this.dimension,
            VecXZ.create({ x: startX, z: startZ }),
            VecXZ.create({ x: startX + 15, z: startZ + 15 })
          )
        );
      }
    }

    return chunks;
      },
      toString() { return `ChunkArea: [${from.x}, ${from.z}] - [${to.x}, ${to.z}] (${widthChunks}x${heightChunks} chunks)`; },
    };
}

/**
 * ChunkArea関連のユーティリティ
 */
const AREA_STEP = 4;

  /**
   * 指定座標を起点とした n×m チャンク範囲を取得する
   */
export function getChunkArea(
    dimension: Dimension,
    origin: VectorXZ,
    widthChunks: number,
    heightChunks: number
  ): ChunkArea {
    return createChunkArea(dimension, origin, widthChunks, heightChunks);
  }

  /**
   * 指定座標を中心とした n×m チャンク範囲を生成する
   * (widthChunks/heightChunksが偶数の場合は起点側に寄る)
   */
export function getChunkAreafromCenter(
    dimension: Dimension,
    center: VectorXZ,
    widthChunks: number,
    heightChunks: number
  ): ChunkArea {
    const centerChunkX = Math.floor(center.x / 16);
    const centerChunkZ = Math.floor(center.z / 16);

    const originChunkX = centerChunkX - Math.floor((widthChunks - 1) / 2);
    const originChunkZ = centerChunkZ - Math.floor((heightChunks - 1) / 2);

    return createChunkArea(
      dimension,
      VecXZ.create({ x: originChunkX * 16, z: originChunkZ * 16 }),
      widthChunks,
      heightChunks
    );
  }

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
export function showChunkAreaBounds(
    player: Player,
    dimension: Dimension,
    location: Vector3,
    widthChunks: number,
    heightChunks: number,
    particleId: string = DEFAULT_PARTICLE_ID
  ): ChunkArea {
    const area: ChunkArea = getChunkArea(
      dimension,
      location,
      widthChunks,
      heightChunks
    );
		
		const molang = new MolangVariableMap();
		molang.setFloat("width", 0.01 * (widthChunks + heightChunks));

    for (let x = area.from.x; x <= area.to.x + 1; x += AREA_STEP) {
      Particle.spawnAsPlayer(player, particleId, dimension, { x, y: location.y, z: area.from.z }, molang);
      Particle.spawnAsPlayer(player, particleId, dimension, { x, y: location.y, z: area.to.z + 1 }, molang);
    }

    for (let z = area.from.z; z <= area.to.z + 1; z += AREA_STEP) {
      Particle.spawnAsPlayer(player, particleId, dimension, { x: area.from.x, y: location.y, z }, molang);
      Particle.spawnAsPlayer(player, particleId, dimension, { x: area.to.x + 1, y: location.y, z }, molang);
    }

    return area;
  }

  /**
   * 指定座標を中心とした n×m チャンク範囲の外周にパーティクルを表示する
   */
export function showChunkAreaBoundsFromCenter(
    player: Player,
    dimension: Dimension,
    center: Vector3,
    widthChunks: number,
    heightChunks: number,
    particleId: string = DEFAULT_PARTICLE_ID
  ): ChunkArea {
    const area: ChunkArea = getChunkAreafromCenter(
      dimension,
      center,
      widthChunks,
      heightChunks
    );

		const molang = new MolangVariableMap();
		molang.setFloat("width", 0.01 * (widthChunks + heightChunks));

    for (let x = area.from.x; x <= area.to.x + 1; x += AREA_STEP) {
      Particle.spawnAsPlayer(player, particleId, dimension, { x, y: center.y, z: area.from.z }, molang);
      Particle.spawnAsPlayer(player, particleId, dimension, { x, y: center.y, z: area.to.z + 1 }, molang);
    }

    for (let z = area.from.z; z <= area.to.z + 1; z += AREA_STEP) {
      Particle.spawnAsPlayer(player, particleId, dimension, { x: area.from.x, y: center.y, z }, molang);
      Particle.spawnAsPlayer(player, particleId, dimension, { x: area.to.x + 1, y: center.y, z }, molang);
    }

    return area;
  }
