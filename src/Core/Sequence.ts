import { system, world } from "@minecraft/server";

// ───────── 型定義 ─────────

/** 数値なら固定tick、[最小, 最大] ならその範囲(両端含む)からランダム */
export type Delay = number | readonly [min: number, max: number];

export interface SequenceStep {
  /** 「直前のステップが終わってから」何tick後に実行するか */
  delay: Delay;
  run: () => void;
}

export interface SequenceOptions {
  /** 全ステップが終わったら呼ばれる(キャンセル時は呼ばれない) */
  onComplete?: () => void;
  /** ステップが例外を投げたら呼ばれる。省略時は console.warn。シーケンスは続行する */
  onError?: (error: unknown, index: number) => void;
}

export interface SequenceHandle {
  /** 以降のステップをすべて中止する */
  cancel(): void;
  readonly isRunning: boolean;
}

// ───────── 内部ユーティリティ ─────────

function resolveDelay(delay: Delay): number {
  if (typeof delay === "number") {
    return Math.max(0, Math.floor(delay));
  }
  const lo = Math.floor(Math.min(delay[0], delay[1]));
  const hi = Math.floor(Math.max(delay[0], delay[1]));
  return Math.max(0, lo + Math.floor(Math.random() * (hi - lo + 1)));
}

// ───────── 本体 ─────────

export function runSequence(
  steps: readonly SequenceStep[],
  options: SequenceOptions = {}
): SequenceHandle {
  let index = 0;
  let running = true;
  let timerId: number | undefined;

  const next = (): void => {
    if (!running) return;

    if (index >= steps.length) {
      running = false;
      options.onComplete?.();
      return;
    }

    const i = index++;
    const step = steps[i];

    timerId = system.runTimeout(() => {
      timerId = undefined;
      if (!running) return;

      try {
        step.run();
      } catch (e) {
        if (options.onError) options.onError(e, i);
        else console.warn(`Sequence step ${i} threw an error:`, e);
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