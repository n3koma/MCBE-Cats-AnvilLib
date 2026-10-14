import { Entity } from "@minecraft/server";
type HealthComparison = "lte" | "gte";
type HealthCondition = {
    /** 比較の種類。lte = 以下、gte = 以上 */
    comparison: HealthComparison;
    /** 閾値。isPercentage=trueなら0〜100の割合、falseなら絶対値(HP) */
    value: number;
    /** trueなら割合判定、falseなら絶対値判定 */
    isPercentage: boolean;
};
export type BehaviorScheduler = {
    /** 識別用の名前（デバッグ・ログ用、実行回数カウントのキーとしても使う） */
    id: string;
    /** 何ティックごとに実行するか */
    intervalTicks: number;
    /** 全体のtickカウンタに対するズレ（同時発火を避けたい時用、省略可） */
    offset?: number;
    /** 体力条件。省略時は常に条件クリア扱い */
    healthCondition?: HealthCondition;
    /** 実行回数の上限。省略時は無制限 */
    maxExecutions?: number;
    /** 実際の処理 */
    action: (monolith: Entity, tick: number) => void;
};
export declare function runScheduledBehaviors(behaviors: readonly BehaviorScheduler[], entity: Entity, tick: number): void;
export {};
