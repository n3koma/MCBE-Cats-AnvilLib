export var ColorCode;
(function (ColorCode) {
    // ── 色 ────────────────────────────────────
    ColorCode["Black"] = "\u00A70";
    ColorCode["DarkBlue"] = "\u00A71";
    ColorCode["DarkGreen"] = "\u00A72";
    ColorCode["DarkAqua"] = "\u00A73";
    ColorCode["DarkRed"] = "\u00A74";
    ColorCode["DarkPurple"] = "\u00A75";
    ColorCode["Golden"] = "\u00A76";
    ColorCode["Gray"] = "\u00A77";
    ColorCode["DarkGray"] = "\u00A78";
    ColorCode["Blue"] = "\u00A79";
    ColorCode["Green"] = "\u00A7a";
    ColorCode["Aqua"] = "\u00A7b";
    ColorCode["Red"] = "\u00A7c";
    ColorCode["LightPurple"] = "\u00A7d";
    ColorCode["Yellow"] = "\u00A7e";
    ColorCode["White"] = "\u00A7f";
    ColorCode["LightBlue"] = "\u00A7w";
    ColorCode["MinecoinGold"] = "\u00A7g";
    ColorCode["Resin"] = "\u00A7v";
    ColorCode["Amethyst"] = "\u00A7u";
    ColorCode["Quartz"] = "\u00A7h";
    ColorCode["Copper"] = "\u00A7n";
    ColorCode["Iron"] = "\u00A7i";
    ColorCode["Lapis"] = "\u00A7t";
    ColorCode["Redstone"] = "\u00A7m";
    ColorCode["Gold"] = "\u00A7p";
    ColorCode["Diamond"] = "\u00A7s";
    ColorCode["Emerald"] = "\u00A7q";
    ColorCode["Netherite"] = "\u00A7j";
    // ── 装飾コード ────────────────────────────────────
    ColorCode["Reset"] = "\u00A7r";
    ColorCode["Bold"] = "\u00A7l";
    ColorCode["Italic"] = "\u00A7o";
    ColorCode["Obfuscated"] = "\u00A7k";
})(ColorCode || (ColorCode = {}));
/**
 * 色の定義そのもの。値は全部 0~1 の整数で持ってる。
 */
export const Color = {
    Black: toRGBA({ r: 0, g: 0, b: 0, a: 1 }),
    White: toRGBA({ r: 255, g: 255, b: 255, a: 1 }),
    Red: toRGBA({ r: 255, g: 0, b: 0, a: 1 }),
    Green: toRGBA({ r: 0, g: 255, b: 0, a: 1 }),
    Blue: toRGBA({ r: 0, g: 0, b: 255, a: 1 }),
    Yellow: toRGBA({ r: 255, g: 255, b: 0, a: 1 }),
    Aqua: toRGBA({ r: 0, g: 255, b: 255, a: 1 }),
    Purple: toRGBA({ r: 170, g: 0, b: 255, a: 1 }),
    Gold: toRGBA({ r: 255, g: 170, b: 0, a: 1 }),
    Gray: toRGBA({ r: 128, g: 128, b: 128, a: 1 }),
};
/** 0~255 の値を 0~1 にクランプしつつ変換する */
function clampToUnit(value) {
    return Math.min(1, Math.max(0, value / 255));
}
/**
 * Color（0~255）を、TextPrimitiveなどが要求するRGBA（0~1）に変換する。
 * 範囲外の値(負の数や256以上)が来ても0~1にクランプするから安心してね。
 */
function toRGBA(color) {
    return {
        red: clampToUnit(color.r),
        green: clampToUnit(color.g),
        blue: clampToUnit(color.b),
        alpha: color.a,
    };
}
