export function toKey(nameSpace: string, ...args: any[]): string {
	return `${nameSpace}:${args.join("_")}`;
}

export function stripColorCodes(text: string): string {
	return text.replace(/§./g, "");
}