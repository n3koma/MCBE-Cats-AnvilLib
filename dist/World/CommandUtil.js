import { CustomCommandStatus } from "@minecraft/server";
export function ok(message) {
    return { status: CustomCommandStatus.Success, message };
}
export function fail(message) {
    return { status: CustomCommandStatus.Failure, message };
}
