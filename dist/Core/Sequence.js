import { system } from "@minecraft/server";
// ───────── 内部ユーティリティ ─────────
function resolveDelay(delay) {
    if (typeof delay === "number") {
        return Math.max(0, Math.floor(delay));
    }
    const lo = Math.floor(Math.min(delay[0], delay[1]));
    const hi = Math.floor(Math.max(delay[0], delay[1]));
    return Math.max(0, lo + Math.floor(Math.random() * (hi - lo + 1)));
}
// ───────── 本体 ─────────
export function runSequence(steps, options = {}) {
    let index = 0;
    let running = true;
    let timerId;
    const next = () => {
        if (!running)
            return;
        if (index >= steps.length) {
            running = false;
            options.onComplete?.();
            return;
        }
        const i = index++;
        const step = steps[i];
        timerId = system.runTimeout(() => {
            timerId = undefined;
            if (!running)
                return;
            try {
                step.run();
            }
            catch (e) {
                if (options.onError)
                    options.onError(e, i);
                else
                    console.warn(`Sequence step ${i} threw an error:`, e);
            }
            next();
        }, resolveDelay(step.delay));
    };
    next();
    return {
        cancel() {
            running = false;
            if (timerId !== undefined) {
                system.clearRun(timerId);
                timerId = undefined;
            }
        },
        get isRunning() {
            return running;
        },
    };
}
