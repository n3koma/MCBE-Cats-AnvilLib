const MAX_MITIGATION = 20;
const MITIGATION_DIVISOR = 25;
const BINARY_SEARCH_ITERATIONS = 30;

  /**
   * 防具による軽減後のダメージから、軽減前(raw)ダメージを逆算する。
   * forwardDamage は raw に対して単調増加なので、二分探索でピンポイントに解けるってわけ。
   */
export function reverseDamageFromArmorReduction(
    reducedDamage: number,
    defensePoints: number = 0,
    toughness: number = 0,
  ): number {
    if (!Number.isFinite(reducedDamage) || reducedDamage <= 0) return 0;

    const armor = Math.max(0, defensePoints);
    const armorToughness = Math.max(0, toughness);

    // 防具なしなら軽減もゼロ、二分探索するまでもないよね
    if (armor === 0) return reducedDamage;

    const forwardDamage = (rawDamage: number): number => {
      const clampedRaw = Math.max(0, rawDamage);
      const mitigation = Math.min(
        MAX_MITIGATION,
        Math.max(armor / 5, armor - (4 * clampedRaw) / (armorToughness + 8)),
      );
      return clampedRaw * (1 - mitigation / MITIGATION_DIVISOR);
    };

    // 防具点0~20の範囲では最大80%軽減になるから、raw <= reduced / 0.2 が探索上限の目安
    let low = reducedDamage;
    let high = Math.max(reducedDamage / 0.2, reducedDamage + 1);

    for (let i = 0; i < BINARY_SEARCH_ITERATIONS; i++) {
      const mid = (low + high) / 2;
      if (forwardDamage(mid) < reducedDamage) {
        low = mid;
      } else {
        high = mid;
      }
    }

    return (low + high) / 2;
}