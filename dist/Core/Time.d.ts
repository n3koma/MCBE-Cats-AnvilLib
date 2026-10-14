/**
 * Minecraft 統合版 (Bedrock Edition) 時間関連の定数・関数集
 * ------------------------------------------------------------
 * ワールド内の時刻（tick）は「1日 = 24000 tick」で 0〜23999 をループする値。
 * tick=0 を朝6:00として、tick / 1000 + 6 (mod 24) でゲーム内時刻（時）に変換できる。
 *
 * 依存なし・純粋関数のみで構成しているので、ビヘイビアパック内(@minecraft/server)でも
 * Node/ブラウザ側のツールでも同じロジックをそのまま使い回せる。
 */
/** 0〜23999 でループする「その日の中の時刻」を表す tick */
export type TickOfDay = number;
/** ワールド生成からの累積 tick（日をまたいでも増え続ける） */
export type AbsoluteTick = number;
/** ゲーム内の時刻（時・分） */
export interface GameTime {
    hour: number;
    minute: number;
}
/** 1日の中のおおまかな時間帯 */
export type TimeOfDayPeriod = "sunrise" | "day" | "sunset" | "night";
/** 1秒あたりの tick 数（20 TPS が基準。実機では負荷により変動する点に注意） */
export declare const TICKS_PER_SECOND = 20;
/** 1ミリ秒あたりの tick 数 */
export declare const TICKS_PER_MILLISECOND = 0.02;
/** 1分あたりの tick 数 */
export declare const TICKS_PER_MINUTE = 1200;
/** ゲーム内1時間あたりの tick 数（24000 tick = ゲーム内24時間 → 1000） */
export declare const TICKS_PER_GAME_HOUR = 1000;
/** ゲーム内1日（昼夜1周）あたりの tick 数 */
export declare const TICKS_PER_GAME_DAY = 24000;
/** 月齢が1周する日数 */
export declare const DAYS_PER_MOON_CYCLE = 8;
/** 基準TPSにおける1 tickあたりの実時間（ミリ秒） */
export declare const MILLISECOND_PER_TICK = 50;
/** ゲーム内1日が経過するのにかかる実時間（ミリ秒）＝ 理論値20分 */
export declare const MILLISECOND_PER_GAME_DAY = 1200000;
/** `/time set <name>` に対応するプリセット名と tick 値 */
export declare const TIME_PRESETS: {
    readonly sunrise: 23000;
    readonly day: 1000;
    readonly noon: 6000;
    readonly sunset: 12000;
    readonly night: 13000;
    readonly midnight: 18000;
};
export type TimePresetName = keyof typeof TIME_PRESETS;
export declare const TIME_SUNRISE: 23000;
export declare const TIME_DAY: 1000;
export declare const TIME_NOON: 6000;
export declare const TIME_SUNSET: 12000;
export declare const TIME_NIGHT: 13000;
export declare const TIME_MIDNIGHT: 18000;
/** モンスターがスポーンしやすくなる目安の tick 範囲（実際は明るさ次第で前後する） */
export declare const MONSTER_SPAWN_TICK_START: 13000;
export declare const MONSTER_SPAWN_TICK_END: 23000;
/** Minecraft の月齢（8段階ループ）。0 が満月。 */
export declare enum MoonPhase {
    FullMoon = 0,
    WaningGibbous = 1,
    LastQuarter = 2,
    WaningCrescent = 3,
    NewMoon = 4,
    WaxingCrescent = 5,
    FirstQuarter = 6,
    WaxingGibbous = 7
}
/** 月齢の日本語名 */
export declare const MOON_PHASE_NAMES: Record<MoonPhase, string>;
/**
 * 経過日数から月齢を求める。
 * @param dayCount ワールド開始からの経過日数
 */
export declare function getMoonPhase(dayCount: number): MoonPhase;
/** 負数や24000超えの値も 0〜23999 に正規化する */
export declare function normalizeTick(tick: number): TickOfDay;
/** 累積 tick から経過日数を求める（0日目からスタート） */
export declare function tickToDayCount(absoluteTick: AbsoluteTick): number;
/** 経過日数から、その日が始まる累積 tick を求める */
export declare function dayCountToTick(dayCount: number): AbsoluteTick;
/** tick を実時間のミリ秒に変換する */
export declare function ticksToMilliseconds(ticks: number, precision?: number): number;
/** tick を実時間の秒数に変換する（理論値。実機TPSが低いと実際はもっと長くなる） */
export declare function ticksToSeconds(ticks: number, precision?: number): number;
/** tick を実時間の分に変換する */
export declare function ticksToMinutes(ticks: number, precision?: number): number;
/** 実時間のミリ秒を tick に変換する */
export declare function millisecondsToTicks(ms: number, precision?: number): number;
/** 実時間の秒数を tick に変換する */
export declare function secondsToTicks(seconds: number, precision?: number): number;
/** 実時間の分を tick に変換する */
export declare function minutesToTicks(minutes: number, precision?: number): number;
/**
 * tick をゲーム内の「時」（小数を含む, 0〜24未満）に変換する。
 * tick=0 は 6:00 に対応する。
 */
export declare function tickToGameHour(tick: TickOfDay): number;
/** ゲーム内の「時」（0〜24, 小数可）を tick に変換する（tickToGameHour の逆変換） */
export declare function gameHourToTick(hour: number): TickOfDay;
/** tick をゲーム内の {hour, minute} に変換する */
export declare function tickToGameTime(tick: TickOfDay): GameTime;
/** tick を "HH:MM" 形式（24時間表記）の文字列にフォーマットする */
export declare function formatGameTime(tick: TickOfDay): string;
/** 昼（tick 1000〜11999、7:00〜18:00相当）かどうか */
export declare function isDaytime(tick: TickOfDay): boolean;
/** 夜（tick 13000〜22999、19:00〜5:00相当）かどうか */
export declare function isNighttime(tick: TickOfDay): boolean;
/** モンスターがスポーンしやすい時間帯かどうかの簡易判定（明るさは考慮しない目安） */
export declare function canMonstersSpawn(tick: TickOfDay): boolean;
/** tick から大まかな時間帯（日の出/昼/夕方/夜）を求める */
export declare function getTimeOfDayPeriod(tick: TickOfDay): TimeOfDayPeriod;
/** 時間帯の日本語ラベル */
export declare const TIME_OF_DAY_PERIOD_LABELS: Record<TimeOfDayPeriod, string>;
/**
 * 現在の tick から、指定した目標 tick（または時刻プリセット名）までの
 * 最短の残り tick 数を求める（常に 0〜23999 の範囲。既にその時刻なら 0）。
 */
export declare function ticksUntil(currentTick: TickOfDay, target: TickOfDay | TimePresetName): number;
/** 指定 tick（またはプリセット）までの残り時間を実時間の秒数で求める */
export declare function secondsUntil(currentTick: TickOfDay, target: TickOfDay | TimePresetName): number;
