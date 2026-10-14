/**
 * Minecraft 統合版 (Bedrock Edition) 時間関連の定数・関数集
 * ------------------------------------------------------------
 * ワールド内の時刻（tick）は「1日 = 24000 tick」で 0〜23999 をループする値。
 * tick=0 を朝6:00として、tick / 1000 + 6 (mod 24) でゲーム内時刻（時）に変換できる。
 *
 * 依存なし・純粋関数のみで構成しているので、ビヘイビアパック内(@minecraft/server)でも
 * Node/ブラウザ側のツールでも同じロジックをそのまま使い回せる。
 */

// ============================================================
// 型定義
// ============================================================

/** 0〜23999 でループする「その日の中の時刻」を表す tick */
export type TickOfDay = number;

/** ワールド生成からの累積 tick（日をまたいでも増え続ける） */
export type AbsoluteTick = number;

/** ゲーム内の時刻（時・分） */
export interface GameTime {
  hour: number; // 0〜23
  minute: number; // 0〜59
}

/** 1日の中のおおまかな時間帯 */
export type TimeOfDayPeriod = "sunrise" | "day" | "sunset" | "night";

// ============================================================
// 基本定数
// ============================================================

/** 1秒あたりの tick 数（20 TPS が基準。実機では負荷により変動する点に注意） */
export const TICKS_PER_SECOND = 20;

/** 1ミリ秒あたりの tick 数 */
export const TICKS_PER_MILLISECOND = 0.02;

/** 1分あたりの tick 数 */
export const TICKS_PER_MINUTE = 1200;

/** ゲーム内1時間あたりの tick 数（24000 tick = ゲーム内24時間 → 1000） */
export const TICKS_PER_GAME_HOUR = 1000;

/** ゲーム内1日（昼夜1周）あたりの tick 数 */
export const TICKS_PER_GAME_DAY = 24000;

/** 月齢が1周する日数 */
export const DAYS_PER_MOON_CYCLE = 8;

/** 基準TPSにおける1 tickあたりの実時間（ミリ秒） */
export const MILLISECOND_PER_TICK = 50;

/** ゲーム内1日が経過するのにかかる実時間（ミリ秒）＝ 理論値20分 */
export const MILLISECOND_PER_GAME_DAY = 1200000;

// ============================================================
// 時刻プリセット（/time set と対応する値）
// ============================================================

/** `/time set <name>` に対応するプリセット名と tick 値 */
export const TIME_PRESETS = {
  sunrise: 23000,
  day: 1000,
  noon: 6000,
  sunset: 12000,
  night: 13000,
  midnight: 18000,
} as const;

export type TimePresetName = keyof typeof TIME_PRESETS;

// 個別定数としても参照できるようにしておく
export const TIME_SUNRISE = TIME_PRESETS.sunrise;
export const TIME_DAY = TIME_PRESETS.day;
export const TIME_NOON = TIME_PRESETS.noon;
export const TIME_SUNSET = TIME_PRESETS.sunset;
export const TIME_NIGHT = TIME_PRESETS.night;
export const TIME_MIDNIGHT = TIME_PRESETS.midnight;

/** モンスターがスポーンしやすくなる目安の tick 範囲（実際は明るさ次第で前後する） */
export const MONSTER_SPAWN_TICK_START = TIME_NIGHT; // 13000
export const MONSTER_SPAWN_TICK_END = TIME_SUNRISE; // 23000

// ============================================================
// 月齢
// ============================================================

/** Minecraft の月齢（8段階ループ）。0 が満月。 */
export enum MoonPhase {
  FullMoon = 0,
  WaningGibbous = 1,
  LastQuarter = 2,
  WaningCrescent = 3,
  NewMoon = 4,
  WaxingCrescent = 5,
  FirstQuarter = 6,
  WaxingGibbous = 7,
}

/** 月齢の日本語名 */
export const MOON_PHASE_NAMES: Record<MoonPhase, string> = {
  [MoonPhase.FullMoon]: "満月",
  [MoonPhase.WaningGibbous]: "十六夜〜下弦前（欠けていく月）",
  [MoonPhase.LastQuarter]: "下弦の月",
  [MoonPhase.WaningCrescent]: "有明の月（新月に近い細い月）",
  [MoonPhase.NewMoon]: "新月",
  [MoonPhase.WaxingCrescent]: "三日月（満ちていく細い月）",
  [MoonPhase.FirstQuarter]: "上弦の月",
  [MoonPhase.WaxingGibbous]: "十三夜〜満月前（満ちていく月）",
};

/**
 * 経過日数から月齢を求める。
 * @param dayCount ワールド開始からの経過日数
 */
export function getMoonPhase(dayCount: number): MoonPhase {
  const normalized =
    ((Math.floor(dayCount) % DAYS_PER_MOON_CYCLE) + DAYS_PER_MOON_CYCLE) % DAYS_PER_MOON_CYCLE;
  return normalized as MoonPhase;
}

// ============================================================
// tick の正規化・単位変換
// ============================================================

/** 負数や24000超えの値も 0〜23999 に正規化する */
export function normalizeTick(tick: number): TickOfDay {
  return ((tick % TICKS_PER_GAME_DAY) + TICKS_PER_GAME_DAY) % TICKS_PER_GAME_DAY;
}

/** 累積 tick から経過日数を求める（0日目からスタート） */
export function tickToDayCount(absoluteTick: AbsoluteTick): number {
  return Math.floor(absoluteTick / TICKS_PER_GAME_DAY);
}

/** 経過日数から、その日が始まる累積 tick を求める */
export function dayCountToTick(dayCount: number): AbsoluteTick {
  return dayCount * TICKS_PER_GAME_DAY;
}

/** tick を実時間のミリ秒に変換する */
export function ticksToMilliseconds(ticks: number, precision: number = 2): number {
  return Number((ticks * MILLISECOND_PER_TICK).toFixed(precision));
}

/** tick を実時間の秒数に変換する（理論値。実機TPSが低いと実際はもっと長くなる） */
export function ticksToSeconds(ticks: number, precision: number = 2): number {
  return Number((ticks / TICKS_PER_SECOND).toFixed(precision));
}

/** tick を実時間の分に変換する */
export function ticksToMinutes(ticks: number, precision: number = 2): number {
  return Number((ticks / TICKS_PER_MINUTE).toFixed(precision));
}

/** 実時間のミリ秒を tick に変換する */
export function millisecondsToTicks(ms: number, precision: number = 2): number {
  return Number((ms / MILLISECOND_PER_TICK).toFixed(precision));
}

/** 実時間の秒数を tick に変換する */
export function secondsToTicks(seconds: number, precision: number = 2): number {
  return Number((seconds * TICKS_PER_SECOND).toFixed(precision));
}

/** 実時間の分を tick に変換する */
export function minutesToTicks(minutes: number, precision: number = 2): number {
	return Number((minutes * TICKS_PER_MINUTE).toFixed(precision));
}

// ============================================================
// ゲーム内時刻（時・分）への変換
// ============================================================

/**
 * tick をゲーム内の「時」（小数を含む, 0〜24未満）に変換する。
 * tick=0 は 6:00 に対応する。
 */
export function tickToGameHour(tick: TickOfDay): number {
  const normalized = normalizeTick(tick);
  return ((normalized / TICKS_PER_GAME_HOUR) + 6) % 24;
}

/** ゲーム内の「時」（0〜24, 小数可）を tick に変換する（tickToGameHour の逆変換） */
export function gameHourToTick(hour: number): TickOfDay {
  const normalizedHour = (((hour - 6) % 24) + 24) % 24;
  return normalizeTick(Math.round(normalizedHour * TICKS_PER_GAME_HOUR));
}

/** tick をゲーム内の {hour, minute} に変換する */
export function tickToGameTime(tick: TickOfDay): GameTime {
  const totalMinutes = tickToGameHour(tick) * 60;
  const hour = Math.floor(totalMinutes / 60) % 24;
  const minute = Math.floor(totalMinutes % 60);
  return { hour, minute };
}

/** tick を "HH:MM" 形式（24時間表記）の文字列にフォーマットする */
export function formatGameTime(tick: TickOfDay): string {
  const { hour, minute } = tickToGameTime(tick);
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// ============================================================
// 判定関数
// ============================================================

/** 昼（tick 1000〜11999、7:00〜18:00相当）かどうか */
export function isDaytime(tick: TickOfDay): boolean {
  const t = normalizeTick(tick);
  return t >= TIME_DAY && t < TIME_SUNSET;
}

/** 夜（tick 13000〜22999、19:00〜5:00相当）かどうか */
export function isNighttime(tick: TickOfDay): boolean {
  const t = normalizeTick(tick);
  return t >= TIME_NIGHT && t < TIME_SUNRISE;
}

/** モンスターがスポーンしやすい時間帯かどうかの簡易判定（明るさは考慮しない目安） */
export function canMonstersSpawn(tick: TickOfDay): boolean {
  const t = normalizeTick(tick);
  return t >= MONSTER_SPAWN_TICK_START && t < MONSTER_SPAWN_TICK_END;
}

/** tick から大まかな時間帯（日の出/昼/夕方/夜）を求める */
export function getTimeOfDayPeriod(tick: TickOfDay): TimeOfDayPeriod {
  const t = normalizeTick(tick);
  if (t >= TIME_SUNRISE || t < TIME_DAY) return "sunrise";
  if (t < TIME_SUNSET) return "day";
  if (t < TIME_NIGHT) return "sunset";
  return "night";
}

/** 時間帯の日本語ラベル */
export const TIME_OF_DAY_PERIOD_LABELS: Record<TimeOfDayPeriod, string> = {
  sunrise: "日の出",
  day: "昼",
  sunset: "夕方（日没）",
  night: "夜",
};

// ============================================================
// その他ユーティリティ
// ============================================================

/**
 * 現在の tick から、指定した目標 tick（または時刻プリセット名）までの
 * 最短の残り tick 数を求める（常に 0〜23999 の範囲。既にその時刻なら 0）。
 */
export function ticksUntil(currentTick: TickOfDay, target: TickOfDay | TimePresetName): number {
  const targetTick = typeof target === "string" ? TIME_PRESETS[target] : normalizeTick(target);
  return normalizeTick(targetTick - normalizeTick(currentTick));
}

/** 指定 tick（またはプリセット）までの残り時間を実時間の秒数で求める */
export function secondsUntil(currentTick: TickOfDay, target: TickOfDay | TimePresetName): number {
  return ticksToSeconds(ticksUntil(currentTick, target));
}