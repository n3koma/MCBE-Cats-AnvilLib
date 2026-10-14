import { world } from "@minecraft/server";

const debugTag = "debug";

export function log(message: string): void {
	world.getPlayers({ tags: [debugTag] }).forEach((player) => {
		player.sendMessage(message);
	});
}
