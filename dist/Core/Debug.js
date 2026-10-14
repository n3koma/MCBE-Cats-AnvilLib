import { world } from "@minecraft/server";
const debugTag = "mclib:debug";
export function log(message) {
    world.getPlayers({ tags: [debugTag] }).forEach((player) => {
        player.sendMessage(message);
    });
}
