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

export class RawTextBuilder {
	constructor (
		private rawMessages: RawMessage[] = []
	) {}
	
	text(text: string | undefined): RawTextBuilder {
		this.rawMessages.push({ text });
		return this;
	}

	translate(translate: string | undefined, withArgs?: string[] | RawMessage | undefined): RawTextBuilder {
		this.rawMessages.push({ translate, with: withArgs });
		return this;
	}

	rawText(rawText: RawText): RawTextBuilder {
		this.rawMessages.push(rawText);
		return this;
	}

	push(rawMessage: RawMessage): RawTextBuilder {
		this.rawMessages.push(rawMessage);
		return this;
	}

	pop(): RawTextBuilder {
		this.rawMessages.pop()
		return this;
	}

	pushed(rawMessage: RawMessage): number {
		return this.rawMessages.push(rawMessage);
	}

	popped(): RawMessage | undefined {
		return this.rawMessages.pop();
	}

	build(): RawText {
		return { rawtext: this.rawMessages };
	}

	toString(): string {
		return JSON.stringify(this.build());
	}

	toJSON(): RawText {
		return this.build();
	}
}

export function rawText(translate: string, withArgs?: string[] | RawMessage | undefined): RawText {
	return new RawTextBuilder().translate(translate, withArgs).build();
}