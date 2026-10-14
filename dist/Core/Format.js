export function toKey(nameSpace, ...args) {
    return `${nameSpace}:${args.join("_")}`;
}
export function stripColorCodes(text) {
    return text.replace(/§./g, "");
}
