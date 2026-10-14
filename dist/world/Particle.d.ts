import { Dimension, MolangVariableMap, Player, Vector3 } from "@minecraft/server";
export declare function spawn(particleId: string, dimension: Dimension, location: Vector3, molang?: MolangVariableMap): void;
export declare function spawnAsPlayer(player: Player, particleId: string, dimension: Dimension, location: Vector3, molang?: MolangVariableMap): void;
