import { Entity } from "@minecraft/server";

type HealthComparison = "lte" | "gte"; // 以下 / 以上

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

const EXEC_COUNT_PREFIX = "behavior_exec_count_";

function getExecutionCount(entity: Entity, behaviorId: string): number {
	const raw = entity.getDynamicProperty(EXEC_COUNT_PREFIX + behaviorId);
	return typeof raw === "number" ? raw : 0;
}

function incrementExecutionCount(entity: Entity, behaviorId: string): void {
	const current = getExecutionCount(entity, behaviorId);
	entity.setDynamicProperty(EXEC_COUNT_PREFIX + behaviorId, current + 1);
}

function checkHealthCondition(entity: Entity, condition: HealthCondition): boolean {
	const healthComponent = entity.getComponent("minecraft:health");
	if (!healthComponent) return false; // health componentが無いなら判定不能→falseで安全側に倒す

	const current = healthComponent.currentValue;
	const max = healthComponent.effectiveMax;

	const target = condition.isPercentage ? (current / max) * 100 : current;

	return condition.comparison === "lte" ? target <= condition.value : target >= condition.value;
}

export function runScheduledBehaviors(
	behaviors: readonly BehaviorScheduler[],
	entity: Entity,
	tick: number
): void {
	for (const behavior of behaviors) {
		const offset = behavior.offset ?? 0;
		if ((tick + offset) % behavior.intervalTicks !== 0) continue;

		// 回数制限チェック
		if (behavior.maxExecutions !== undefined) {
			const count = getExecutionCount(entity, behavior.id);
			if (count >= behavior.maxExecutions) continue;
		}

		// 体力条件チェック
		if (behavior.healthCondition && !checkHealthCondition(entity, behavior.healthCondition)) {
			continue;
		}

		behavior.action(entity, tick);

		// 実行したのでカウント加算（maxExecutionsが設定されてる時だけ意味があるけど常に積んでおく）
		if (behavior.maxExecutions !== undefined) {
			incrementExecutionCount(entity, behavior.id);
		}
	}
}