import { RGBA } from "@minecraft/server";
export declare enum ColorCode {
    Black = "\u00A70",
    DarkBlue = "\u00A71",
    DarkGreen = "\u00A72",
    DarkAqua = "\u00A73",
    DarkRed = "\u00A74",
    DarkPurple = "\u00A75",
    Golden = "\u00A76",
    Gray = "\u00A77",
    DarkGray = "\u00A78",
    Blue = "\u00A79",
    Green = "\u00A7a",
    Aqua = "\u00A7b",
    Red = "\u00A7c",
    LightPurple = "\u00A7d",
    Yellow = "\u00A7e",
    White = "\u00A7f",
    LightBlue = "\u00A7w",
    MinecoinGold = "\u00A7g",
    Resin = "\u00A7v",
    Amethyst = "\u00A7u",
    Quartz = "\u00A7h",
    Copper = "\u00A7n",
    Iron = "\u00A7i",
    Lapis = "\u00A7t",
    Redstone = "\u00A7m",
    Gold = "\u00A7p",
    Diamond = "\u00A7s",
    Emerald = "\u00A7q",
    Netherite = "\u00A7j",
    Reset = "\u00A7r",
    Bold = "\u00A7l",
    Italic = "\u00A7o",
    Obfuscated = "\u00A7k"
}
export type ColorCodeName = keyof typeof ColorCode;
/** 0~255 の整数で持つRGBA。生の色データはこの形で管理するよ */
export interface Color {
    r: number;
    g: number;
    b: number;
    a: number;
}
/**
 * 色の定義そのもの。値は全部 0~1 の整数で持ってる。
 */
export declare const Color: Record<string, RGBA>;
export type ColorName = keyof typeof Color;
