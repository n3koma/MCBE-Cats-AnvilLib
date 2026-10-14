
import { Dimension, Entity, EntityQueryOptions, Vector3 } from "@minecraft/server";
import { Vec3 } from "../Core/VectorUtil";

interface AABBM { min: Vector3; max: Vector3 };

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function getWorldAABB(entity: Entity): AABBM {
  const aabb = entity.getAABB();
  const center = aabb.center; // AABBの中心座標 (ワールド座標系)
  const extent = aabb.extent; // 全体サイズ (width, height, width)
  const half = Vec3.scale(extent, 0.5);
  return {
    min: Vec3.sub(center, half),
    max: Vec3.add(center, half),
  };
}

/** 点pをAABB内に収まるようクランプした点（AABB内でpに最も近い点）を返す */
function closestPointInAABB(p: Vector3, box: AABBM): Vector3 {
  return {
    x: clamp(p.x, box.min.x, box.max.x),
    y: clamp(p.y, box.min.y, box.max.y),
    z: clamp(p.z, box.min.z, box.max.z),
  };
}

/** 点pを線分(a-b)上にクランプした点(と媒介変数t)を返す */
function closestPointOnSegment(p: Vector3, a: Vector3, b: Vector3): { point: Vector3; t: number } {
  const ab = Vec3.sub(b, a);
  const abLenSq = Vec3.dot(ab, ab) || 1;
  const t = clamp(Vec3.dot(Vec3.sub(p, a), ab) / abLenSq, 0, 1);
  return { point: Vec3.add(a, Vec3.scale(ab, t)), t };
}

/**
 * 線分(a-b)とAABB(直方体)の最短距離を求める。
 *
 * 線分・AABBはどちらも凸集合なので、
 * 「線分上の点→AABB内の最近接点→その点を線分上にクランプ…」を繰り返す
 * 交互射影法で、真の最短距離に収束する。
 * （球近似と違い、実際の直方体の角・辺・面を正しく考慮できる）
 */
function segmentAABBDistance(a: Vector3, b: Vector3, box: AABBM, iterations = 4): number {
  let p = Vec3.scale(Vec3.add(a, b), 0.5); // 初期値: 線分の中点
  for (let i = 0; i < iterations; i++) {
    const q = closestPointInAABB(p, box);
    p = closestPointOnSegment(q, a, b).point;
  }
  const q = closestPointInAABB(p, box);
  return Vec3.len(Vec3.sub(p, q));
}

/**
 * @remarks
 * 任意の太さ・長さ・向きの円柱範囲内にいるエンティティを取得する。
 *
 * 円柱は始点(origin)から方向(direction)へ length だけ伸びる軸を持ち、
 * 半径 radius の範囲として定義される。
 *
 * 判定方法:
 *   各エンティティのAABB(entity.getAABB()の center/extent)をそのまま直方体として扱い、
 *   円柱の軸線分との最短距離(segmentAABBDistance)が radius 以下であればヒットとみなす。
 *   → 球近似は行わず、実際の直方体形状で判定する。
 *   → ただし円柱の両端は依然として丸まった近似(カプセル状)になる点に注意
 *     （平らな端面が必要な場合は別途、軸方向のクリップ処理が必要）。
 *
 * @param dimension  検索対象のディメンション (例: world.getDimension("overworld"))
 * @param origin     円柱の始点（底面の中心座標）
 * @param direction  円柱の軸方向を示すベクトル。正規化されていなくてもよい
 * @param radius     円柱の半径
 * @param length     円柱の軸方向の長さ
 * @param options    location と maxDistance を除くエンティティ検索オプション
 */
export function getHitCylinderEntity(
  dimension: Dimension,
  origin: Vector3,
  direction: Vector3,
  radius: number,
  length: number,
  options?: Omit<EntityQueryOptions, "location" | "maxDistance">
): Entity[] {
  const axis = Vec3.normalize(direction);
  const endPoint = Vec3.add(origin, Vec3.scale(axis, length));
	const halfPoint = Vec3.add(origin, Vec3.scale(axis, length * 0.5));
  const candidates = dimension.getEntities({ ...options, location: halfPoint, maxDistance: length * 0.6 + radius });
  const result: Entity[] = [];

  for (const entity of candidates) {
    const box = getWorldAABB(entity);
    const dist = segmentAABBDistance(origin, endPoint, box);

    if (dist <= radius) {
      result.push(entity);
    }
  }

  return result;
}