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
export class RawTextBuilder {
    constructor(rawMessages = []) {
        this.rawMessages = rawMessages;
    }
    text(text) {
        this.rawMessages.push({ text });
        return this;
    }
    translate(translate, withArgs) {
        this.rawMessages.push({ translate, with: withArgs });
        return this;
    }
    rawText(rawText) {
        this.rawMessages.push(rawText);
        return this;
    }
    push(rawMessage) {
        this.rawMessages.push(rawMessage);
        return this;
    }
    pop() {
        this.rawMessages.pop();
        return this;
    }
    pushed(rawMessage) {
        return this.rawMessages.push(rawMessage);
    }
    popped() {
        return this.rawMessages.pop();
    }
    build() {
        return { rawtext: this.rawMessages };
    }
    toString() {
        return JSON.stringify(this.build());
    }
    toJSON() {
        return this.build();
    }
}
export function rawText(translate, withArgs) {
    return new RawTextBuilder().translate(translate, withArgs).build();
}
