import { Entity, ScoreboardIdentity, ScoreboardObjective } from "@minecraft/server";
export declare function defineStat(key: string, defaultValue: number): {
    getObjective: (() => ScoreboardObjective | undefined) & {
        reset: () => void;
    };
    default: number;
};
export declare function getObjective(objectiveName: string): ScoreboardObjective | undefined;
/**
 * @remarks
 * Gets an existing objective, or creates it if it doesn't exist yet.
 *
 * This function doesn't throw in restricted-execution mode. If the
 * objective can't be created synchronously (e.g. called from a
 * `beforeEvents` callback), creation is deferred to the next tick via
 * `system.run()`, and this call returns `undefined`.
 */
export declare function addObjectiveIfNotExists(objectiveName: string, displayName?: string): ScoreboardObjective | undefined;
/**
 * @remarks
 * Gets an existing objective, or creates it if it doesn't exist yet.
 *
 * This function doesn't throw in restricted-execution mode. If the
 * objective can't be created synchronously (e.g. called from a
 * `beforeEvents` callback), creation is deferred to the next tick via
 * `system.run()`, and this call returns `undefined`.
 */
export declare function getOrAddObjective(objectiveName: string, displayName?: string): ScoreboardObjective | undefined;
/**
 * @remarks
 * Gets the entity's score for the given objective, or `undefined` if it
 * doesn't exist yet.
 */
export declare function getScoreSafe(objective: ScoreboardObjective, participant: string | Entity | ScoreboardIdentity): number | undefined;
/**
 * @remarks
 * Gets the entity's score for the given objective, initializing the score
 * to `fallback` if it doesn't exist yet.
 *
 * This function doesn't throw in restricted-execution mode. If writes
 * can't complete synchronously, initialization is deferred via
 * `system.run()`, and `fallback` is returned for this call instead.
 */
export declare function getOrSetScore(objective: ScoreboardObjective, participant: string | Entity | ScoreboardIdentity, fallback?: number): number;
