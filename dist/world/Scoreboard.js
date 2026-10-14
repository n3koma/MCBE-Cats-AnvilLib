import { Entity, system, world } from "@minecraft/server";
import { lazy } from "../core/Lazy";
const IDENTITY_INITIALIZATION_OBJECTIVE_NAME = "anvil:identity_init";
export function defineStat(key, defaultValue) {
    return {
        getObjective: lazy(() => getOrAddObjective(key)),
        default: defaultValue,
    };
}
export function getObjective(objectiveName) {
    return world.scoreboard.getObjective(objectiveName);
}
/**
 * @remarks
 * Gets an existing objective, or creates it if it doesn't exist yet.
 *
 * This function doesn't throw in restricted-execution mode. If the
 * objective can't be created synchronously (e.g. called from a
 * `beforeEvents` callback), creation is deferred to the next tick via
 * `system.run()`, and this call returns `undefined`.
 */
export function addObjectiveIfNotExists(objectiveName, displayName) {
    const existing = getObjective(objectiveName);
    if (existing)
        return existing;
    const scoreboard = world.scoreboard;
    try {
        return scoreboard.addObjective(objectiveName, displayName);
    }
    catch {
        system.run(() => {
            try {
                // 例外の間に別コードが作成済みだった場合は何もしない
                if (getObjective(objectiveName))
                    return;
                scoreboard.addObjective(objectiveName, displayName);
            }
            catch {
                // 競合等で失敗しても、この遅延実行では呼び出し元に伝える手段がないため無視
            }
        });
        return undefined;
    }
}
/**
 * @remarks
 * Gets an existing objective, or creates it if it doesn't exist yet.
 *
 * This function doesn't throw in restricted-execution mode. If the
 * objective can't be created synchronously (e.g. called from a
 * `beforeEvents` callback), creation is deferred to the next tick via
 * `system.run()`, and this call returns `undefined`.
 */
export function getOrAddObjective(objectiveName, displayName) {
    const existing = getObjective(objectiveName);
    if (existing)
        return existing;
    try {
        return world.scoreboard.addObjective(objectiveName, displayName);
    }
    catch {
        system.run(() => {
            if (!getObjective(objectiveName)) {
                try {
                    world.scoreboard.addObjective(objectiveName, displayName);
                }
                catch {
                    // 別のコードが同じ間に作成済みなど、無視して問題ない
                }
            }
        });
        return undefined;
    }
}
/**
 * @remarks
 * Ensures the entity has a scoreboard identity by writing a dummy score
 * to an internal "identity init" objective if needed.
 *
 * This function doesn't throw in restricted-execution mode; callers
 * (e.g. `getOrSetScore`) are responsible for catching and deferring.
 */
function ensureScoreboardIdentity(participant) {
    if (participant instanceof Entity && participant.scoreboardIdentity)
        return;
    const identityObjective = getOrAddObjective(IDENTITY_INITIALIZATION_OBJECTIVE_NAME);
    identityObjective?.setScore(participant, 0);
}
/**
 * @remarks
 * Gets the entity's score for the given objective, or `undefined` if it
 * doesn't exist yet.
 */
export function getScoreSafe(objective, participant) {
    try {
        ensureScoreboardIdentity(participant);
        return objective.getScore(participant);
    }
    catch {
        return undefined;
    }
}
/**
 * @remarks
 * Gets the entity's score for the given objective, initializing the score
 * to `fallback` if it doesn't exist yet.
 *
 * This function doesn't throw in restricted-execution mode. If writes
 * can't complete synchronously, initialization is deferred via
 * `system.run()`, and `fallback` is returned for this call instead.
 */
export function getOrSetScore(objective, participant, fallback = 0) {
    try {
        ensureScoreboardIdentity(participant);
        const score = objective.getScore(participant);
        if (score !== undefined)
            return score;
        objective.setScore(participant, fallback);
        return fallback;
    }
    catch {
        system.run(() => {
            try {
                ensureScoreboardIdentity(participant);
                if (objective.getScore(participant) === undefined) {
                    objective.setScore(participant, fallback);
                }
            }
            catch {
                // エンティティが既に削除されている等、これ以上できることはない
            }
        });
        return fallback;
    }
}
