/**
 * 防具による軽減後のダメージから、軽減前(raw)ダメージを逆算する。
 * forwardDamage は raw に対して単調増加なので、二分探索でピンポイントに解けるってわけ。
 */
export declare function reverseDamageFromArmorReduction(reducedDamage: number, defensePoints?: number, toughness?: number): number;
