const EXEC_COUNT_PREFIX = "behavior_exec_count_";
function getExecutionCount(entity, behaviorId) {
    const raw = entity.getDynamicProperty(EXEC_COUNT_PREFIX + behaviorId);
    return typeof raw === "number" ? raw : 0;
}
function incrementExecutionCount(entity, behaviorId) {
    const current = getExecutionCount(entity, behaviorId);
    entity.setDynamicProperty(EXEC_COUNT_PREFIX + behaviorId, current + 1);
}
function checkHealthCondition(entity, condition) {
    const healthComponent = entity.getComponent("minecraft:health");
    if (!healthComponent)
        return false; // health componentが無いなら判定不能→falseで安全側に倒す
    const current = healthComponent.currentValue;
    const max = healthComponent.effectiveMax;
    const target = condition.isPercentage ? (current / max) * 100 : current;
    return condition.comparison === "lte" ? target <= condition.value : target >= condition.value;
}
export function runScheduledBehaviors(behaviors, entity, tick) {
    for (const behavior of behaviors) {
        const offset = behavior.offset ?? 0;
        if ((tick + offset) % behavior.intervalTicks !== 0)
            continue;
        // 回数制限チェック
        if (behavior.maxExecutions !== undefined) {
            const count = getExecutionCount(entity, behavior.id);
            if (count >= behavior.maxExecutions)
                continue;
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
