import { RGBA } from "@minecraft/server";

export const ColorCode = {
	// ── 色 ────────────────────────────────────
	Black: "§0",
	DarkBlue: "§1",
	DarkGreen: "§2",
	DarkAqua: "§3",
	DarkRed: "§4",
	DarkPurple: "§5",
	Golden: "§6",
	Gray: "§7",
	Grey: "§7", // UK English
	DarkGray: "§8",
	DarkGrey: "§8", // UK English
	Blue: "§9",

	Green: "§a",
	Aqua: "§b",
	Red: "§c",
	LightPurple: "§d",
	Yellow: "§e",
	White: "§f",
	LightBlue: "§w",

	MinecoinGold: "§g",

	Resin: "§v",
	Amethyst: "§u",
	Quartz: "§h",
	Copper: "§n",
	Iron: "§i",
	Lapis: "§t",
	Redstone: "§m",
	Gold: "§p",
	Diamond: "§s",
	Emerald: "§q",
	Netherite: "§j",

	// ── 装飾コード ────────────────────────────────────
	Reset: "§r",
	Bold: "§l",
	Italic: "§o",
	Obfuscated: "§k",
} as const;

export interface Color {
	r: number;
	g: number;
	b: number;
	a: number; // alphaだけ 0~1 のまま扱うのが慣習
}

export const Color: Record<string, RGBA> = {
	Black:  /* @__PURE__ */ toRGBA({ r: 0,   g: 0,   b: 0,   a: 1 }),
	White:  /* @__PURE__ */ toRGBA({ r: 255, g: 255, b: 255, a: 1 }),
	Red:    /* @__PURE__ */ toRGBA({ r: 255, g: 0,   b: 0,   a: 1 }),
	Green:  /* @__PURE__ */ toRGBA({ r: 0,   g: 255, b: 0,   a: 1 }),
	Blue:   /* @__PURE__ */ toRGBA({ r: 0,   g: 0,   b: 255, a: 1 }),
	Yellow: /* @__PURE__ */ toRGBA({ r: 255, g: 255, b: 0,   a: 1 }),
	Aqua:   /* @__PURE__ */ toRGBA({ r: 0,   g: 255, b: 255, a: 1 }),
	Purple: /* @__PURE__ */ toRGBA({ r: 170, g: 0,   b: 255, a: 1 }),
	Gold:   /* @__PURE__ */ toRGBA({ r: 255, g: 170, b: 0,   a: 1 }),
	Gray:   /* @__PURE__ */ toRGBA({ r: 128, g: 128, b: 128, a: 1 }),
} as const;

export type ColorCodeName = keyof typeof ColorCode;

export type ColorName = keyof typeof Color;

function toRGBA(color: Color): RGBA {
	return {
		red:   clamp255(color.r),
		green: clamp255(color.g),
		blue:  clamp255(color.b),
		alpha: color.a,
	};
}
 
function clamp255(value: number): number {
	if (value < 0) throw new Error(`Color value must be >= 0, but got ${value}`);
	if (value > 255) throw new Error(`Color value must be <= 255, but got ${value}`);
	return Math.min(1, Math.max(0, value / 255));
}