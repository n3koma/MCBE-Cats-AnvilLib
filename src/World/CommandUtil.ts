import { CustomCommandResult, CustomCommandStatus } from "@minecraft/server";

export function ok(message: string): CustomCommandResult {
	return { status: CustomCommandStatus.Success, message };
}

export function fail(message: string): CustomCommandResult {
	return { status: CustomCommandStatus.Failure, message };
}