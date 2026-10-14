import { Dimension, MolangVariableMap, Player, Vector3 } from "@minecraft/server";

export function spawn(particleId: string, dimension: Dimension, location: Vector3, molang?: MolangVariableMap): void {
	if (dimension.isChunkLoaded(location)) {
		dimension.spawnParticle(particleId, location, molang);
	}
}

export function spawnAsPlayer(player: Player, particleId: string, dimension: Dimension, location: Vector3, molang?: MolangVariableMap): void {
	if (dimension.isChunkLoaded(location)) {
		player.spawnParticle(particleId, location, molang);
	}
}