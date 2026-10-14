import { RGBA } from "@minecraft/server";

export enum ColorCode {
	// ── 色 ────────────────────────────────────
	Black = "§0",
	DarkBlue = "§1",
	DarkGreen = "§2",
	DarkAqua = "§3",
	DarkRed = "§4",
	DarkPurple = "§5",
	Golden = "§6",
	Gray = "§7",
	DarkGray = "§8",
	Blue = "§9",

	Green = "§a",
	Aqua = "§b",
	Red = "§c",
	LightPurple = "§d",
	Yellow = "§e",
	White = "§f",
	LightBlue = "§w",

	MinecoinGold = "§g",

	Resin = "§v",
	Amethyst = "§u",
	Quartz = "§h",
	Copper = "§n",
	Iron = "§i",
	Lapis = "§t",
	Redstone = "§m",
	Gold = "§p",
	Diamond = "§s",
	Emerald = "§q",
	Netherite = "§j",

	// ── 装飾コード ────────────────────────────────────
	Reset = "§r",
	Bold = "§l",
	Italic = "§o",
	Obfuscated = "§k",
}

export type ColorCodeName = keyof typeof ColorCode;

/** 0~255 の整数で持つRGBA。生の色データはこの形で管理するよ */
export interface Color {
	r: number;
	g: number;
	b: number;
	a: number; // alphaだけ 0~1 のまま扱うのが慣習
}
 
/**
 * 色の定義そのもの。値は全部 0~1 の整数で持ってる。
 */
export const Color: Record<string, RGBA> = {
	Black:  toRGBA({ r: 0,   g: 0,   b: 0,   a: 1 }),
	White:  toRGBA({ r: 255, g: 255, b: 255, a: 1 }),
	Red:    toRGBA({ r: 255, g: 0,   b: 0,   a: 1 }),
	Green:  toRGBA({ r: 0,   g: 255, b: 0,   a: 1 }),
	Blue:   toRGBA({ r: 0,   g: 0,   b: 255, a: 1 }),
	Yellow: toRGBA({ r: 255, g: 255, b: 0,   a: 1 }),
	Aqua:   toRGBA({ r: 0,   g: 255, b: 255, a: 1 }),
	Purple: toRGBA({ r: 170, g: 0,   b: 255, a: 1 }),
	Gold:   toRGBA({ r: 255, g: 170, b: 0,   a: 1 }),
	Gray:   toRGBA({ r: 128, g: 128, b: 128, a: 1 }),
} as const;
 
export type ColorName = keyof typeof Color;
 
/** 0~255 の値を 0~1 にクランプしつつ変換する */
function clampToUnit(value: number): number {
	return Math.min(1, Math.max(0, value / 255));
}

/**
 * Color（0~255）を、TextPrimitiveなどが要求するRGBA（0~1）に変換する。
 * 範囲外の値(負の数や256以上)が来ても0~1にクランプするから安心してね。
 */
function toRGBA(color: Color): RGBA {
	return {
		red:   clampToUnit(color.r),
		green: clampToUnit(color.g),
		blue:  clampToUnit(color.b),
		alpha: color.a,
	};
}