import { RawMessage, RawText } from "@minecraft/server";
/**
 * RawText: {
 *   rawtext: RawMessage[]
 * }
 *
 * RawMessage: {
 * 	text?: string,
 * 	translate?: string,
 * 	with?: (string | RawMessage)[],
 * 	rawtext?: RawText,
 * }
 */
export declare class RawTextBuilder {
    private rawMessages;
    constructor(rawMessages?: RawMessage[]);
    text(text: string | undefined): RawTextBuilder;
    translate(translate: string | undefined, withArgs?: string[] | RawMessage | undefined): RawTextBuilder;
    rawText(rawText: RawText): RawTextBuilder;
    push(rawMessage: RawMessage): RawTextBuilder;
    pop(): RawTextBuilder;
    pushed(rawMessage: RawMessage): number;
    popped(): RawMessage | undefined;
    build(): RawText;
    toString(): string;
    toJSON(): RawText;
}
export declare function rawText(translate: string, withArgs?: string[] | RawMessage | undefined): RawText;
