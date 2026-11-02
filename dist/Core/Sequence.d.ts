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
export declare function runSequence(steps: readonly SequenceStep[], options?: SequenceOptions): SequenceHandle;
