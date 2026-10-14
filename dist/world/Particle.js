export function spawn(particleId, dimension, location, molang) {
    if (dimension.isChunkLoaded(location)) {
        dimension.spawnParticle(particleId, location, molang);
    }
}
export function spawnAsPlayer(player, particleId, dimension, location, molang) {
    if (dimension.isChunkLoaded(location)) {
        player.spawnParticle(particleId, location, molang);
    }
}
