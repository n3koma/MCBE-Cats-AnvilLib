import { Dimension, Entity, EntityQueryOptions, Vector3 } from "@minecraft/server";
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
export declare function getHitCylinderEntity(dimension: Dimension, origin: Vector3, direction: Vector3, radius: number, length: number, options?: Omit<EntityQueryOptions, "location" | "maxDistance">): Entity[];
