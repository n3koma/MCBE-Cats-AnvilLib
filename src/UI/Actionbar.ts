// Lib/Actionbar.ts
import { Player, system, world } from "@minecraft/server";

type Segment = {
	text: string;
	separator: string;
	priority: number;
	expiresAtTick?: number; // undefined = 期限なし、手動でclearするまで永続
};

const buffers = new Map<string, Map<string, Segment>>(); // playerId -> (segmentId -> Segment)

const DEFAULT_DURATION = 20;

export function setActionbar(
	player: Player,
	id: string,
	text: string,
	options: { duration?: number; separator?: string; priority?: number } = {}
): void {
	const {
		duration = DEFAULT_DURATION,
		separator = " | ",
		priority = 0,
	} = options;

	const segments = buffers.get(player.id) ?? new Map<string, Segment>();
	segments.set(id, {
		text,
		expiresAtTick: system.currentTick + duration,
		separator,
		priority,
	});
	buffers.set(player.id, segments);
}

export function clearActionbar(player: Player, id: string): void {
	buffers.get(player.id)?.delete(id);
}

export function flushActionbar(player: Player): void {
	const segments = buffers.get(player.id);
	if (!segments || segments.size === 0) return;

	const now = system.currentTick;

	for (const [id, seg] of segments) {
		if (seg.expiresAtTick !== undefined && seg.expiresAtTick <= now) {
			segments.delete(id);
		}
	}

	if (segments.size === 0) {
		player.onScreenDisplay.setActionBar("");
		return;
	}

	const sorted = [...segments.values()].sort((a, b) => a.priority - b.priority);

	const message = sorted
		.map((seg, i) => (i === sorted.length - 1 ? seg.text : seg.text + seg.separator))
		.join("");

	player.onScreenDisplay.setActionBar(message);
}

system.runInterval(() => {
	for (const [playerId, _] of buffers) {
		const player = world.getEntity(playerId);
		if (player instanceof Player) flushActionbar(player);
	}
}, 20);