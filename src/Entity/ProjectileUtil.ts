import { Vector3 } from "@minecraft/server";
import { Vec3 } from "../Core/VectorUtil";

export function getSpreadDirection(from: Vector3, to: Vector3, spreadAmount: number): Vector3 {
		const base = Vec3.normalize(Vec3.sub(from, to));

		// baseに垂直な平面の基準軸を1本だけ作る(これが無いと円が歪む)
		const upHint: Vector3 = Math.abs(base.y) < 0.99 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
		const right = Vec3.normalize(Vec3.cross(upHint, base)); // baseとupHintが直交単位なのでこれも自動的に単位ベクトル
		const up = Vec3.normalize(Vec3.cross(base, right)); // rightとbaseが直交単位なのでこれも自動的に単位ベクトル

		const angle = Math.random() * Math.PI * 2;
		const radius = Math.sqrt(Math.random()) * spreadAmount;

		const offset = Vec3.add(
			Vec3.scale(right, Math.cos(angle) * radius),
			Vec3.scale(up, Math.sin(angle) * radius)
		);

		return Vec3.normalize(Vec3.add(base, offset));
}