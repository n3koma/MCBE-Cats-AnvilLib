import type { Dimension, DimensionLocation, Vector3, Vector2, VectorXZ } from "@minecraft/server";

type VectorKeys<K extends string> = Record<K, number>;

function create<K extends string>(keys: readonly K[], values: Record<K, number>): VectorKeys<K> {
	const result = {} as VectorKeys<K>;
	for (const key of keys) result[key] = values[key];
	return result;
}

function mapEach<K extends string>(keys: readonly K[], value: VectorKeys<K>, fn: (x: number) => number): VectorKeys<K> {
	const r = {} as VectorKeys<K>;
	for (const k of keys) r[k] = fn(value[k]);
	return r;
}

function equal<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): boolean {
	const first = v[0];
	if (!first) return true;
	for (const vec of v) for (const k of keys) if (vec[k] !== first[k]) return false;
	return true;
}

function add<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	const r = splat(keys, 0);
	for (const vec of v) for (const k of keys) r[k] += vec[k];
	return r;
}

function subtract<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): VectorKeys<K> {
	const r = {} as VectorKeys<K>;
	for (const k of keys) r[k] = a[k] - b[k];
	return r;
}

function multiply<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	const r = splat(keys, 1);
	for (const vec of v) for (const k of keys) r[k] *= vec[k];
	return r;
}

function divide<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): VectorKeys<K> {
	const r = {} as VectorKeys<K>;
	for (const k of keys) r[k] = a[k] / b[k];
	return r;
}

function scale<K extends string>(keys: readonly K[], value: VectorKeys<K>, scalar: number): VectorKeys<K> {
	const r = {} as VectorKeys<K>;
	for (const k of keys) r[k] = value[k] * scalar;
	return r;
}

function zero<K extends string>(keys: readonly K[]): VectorKeys<K> {
	return splat(keys, 0);
}

function one<K extends string>(keys: readonly K[]): VectorKeys<K> {
	return splat(keys, 1);
}

function max<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	const r = splat(keys, -Infinity);
	for (const vec of v) for (const k of keys) r[k] = Math.max(r[k], vec[k]);
	return r;
}

function min<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	const r = splat(keys, Infinity);
	for (const vec of v) for (const k of keys) r[k] = Math.min(r[k], vec[k]);
	return r;
}


function floor<K extends string>(keys: readonly K[], value: VectorKeys<K>): VectorKeys<K> {
	return mapEach(keys, value, Math.floor);
}

function ceil<K extends string>(keys: readonly K[], value: VectorKeys<K>): VectorKeys<K> {
	return mapEach(keys, value, Math.ceil);
}

function round<K extends string>(keys: readonly K[], value: VectorKeys<K>): VectorKeys<K> {
	return mapEach(keys, value, Math.round);
}

function splat<K extends string>(keys: readonly K[], value = 1): VectorKeys<K> {
	const r = {} as VectorKeys<K>;
	for (const k of keys) r[k] = value;
	return r;
}

function random<K extends string>(keys: readonly K[], minValue = 0, maxValue = 1): VectorKeys<K> {
	const r = {} as VectorKeys<K>;
	const span = maxValue - minValue;
	for (const k of keys) r[k] = Math.random() * span + minValue;
	return r;
}

function lenSq<K extends string>(keys: readonly K[], value: VectorKeys<K>): number {
	let s = 0;
	for (const k of keys) s += value[k] * value[k];
	return s;
}

function len<K extends string>(keys: readonly K[], value: VectorKeys<K>): number {
	return Math.sqrt(lenSq(keys, value));
}

function normalize<K extends string>(keys: readonly K[], value: VectorKeys<K>): VectorKeys<K> {
	const l = Math.sqrt(lenSq(keys, value));
	const r = {} as VectorKeys<K>;
	for (const k of keys) r[k] = l === 0 ? 0 : value[k] / l;
	return r;
}

function distanceSq<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): number {
	let s = 0;
	for (const k of keys) { const d = a[k] - b[k]; s += d * d; }
	return s;
}

function distance<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): number {
	return Math.sqrt(distanceSq(keys, a, b));
}

function dot<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): number {
	let s = 0;
	for (const k of keys) s += a[k] * b[k];
	return s;
}

function lerp<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>, t: number): VectorKeys<K> {
	const r = {} as VectorKeys<K>;
	for (const k of keys) r[k] = a[k] + (b[k] - a[k]) * t;
	return r;
}

function inRange<K extends string>(keys: readonly K[], value: VectorKeys<K>, from: VectorKeys<K>, to: VectorKeys<K>): boolean {
	for (const k of keys) {
		const lo = Math.min(from[k], to[k]);
		const hi = Math.max(from[k], to[k]);
		if (value[k] < lo || value[k] > hi) return false;
	}
	return true;
}

function isVectorType<K extends string>(keys: readonly K[], value: unknown): value is VectorKeys<K> {
	return typeof value === "object" && value !== null && keys.every(key => typeof (value as Record<string, unknown>)[key] === "number");
}

const VECTOR3_KEYS = ["x", "y", "z"] as const;
const VECTOR2_KEYS = ["x", "y"] as const;
const VECTORXZ_KEYS = ["x", "z"] as const;

function makeVec<K extends string, X extends object>(keys: readonly K[], extra: X) {
	type V = Record<K, number>;
	return {
		create: (values: V) => create(keys, values),
		equal: (...v: V[]) => equal(keys, ...v),
		add: (...v: V[]) => add(keys, ...v),
		subtract: (a: V, b: V) => subtract(keys, a, b),
		multiply: (...v: V[]) => multiply(keys, ...v),
		divide: (a: V, b: V) => divide(keys, a, b),
		scale: (value: V, scalar: number) => scale(keys, value, scalar),
		zero: () => zero(keys),
		one: () => one(keys),
		max: (...v: V[]) => max(keys, ...v),
		min: (...v: V[]) => min(keys, ...v),
		floor: (value: V) => floor(keys, value),
		ceil: (value: V) => ceil(keys, value),
		round: (value: V) => round(keys, value),
		splat: (value = 1) => splat(keys, value),
		random: (minValue = 0, maxValue = 1) => random(keys, minValue, maxValue),
		lenSq: (value: V) => lenSq(keys, value),
		len: (value: V) => len(keys, value),
		normalize: (value: V) => normalize(keys, value),
		distance: (a: V, b: V) => distance(keys, a, b),
		distanceSq: (a: V, b: V) => distanceSq(keys, a, b),
		dot: (a: V, b: V) => dot(keys, a, b),
		lerp: (a: V, b: V, t: number) => lerp(keys, a, b, t),
		in: (value: V, from: V, to: V) => inRange(keys, value, from, to),
		is: (value: unknown): value is V => isVectorType(keys, value),
		...extra,
	};
}

// ---------------------------------------------------------------------------
// Vector3 — private wrappers, exposed only through the Vec3 namespace object
// ---------------------------------------------------------------------------

function up(a = 1): Vector3 { return { x: 0, y: a, z: 0 }; }
function down(a = 1): Vector3 { return { x: 0, y: -a, z: 0 }; }
function cross(a: Vector3, b: Vector3): Vector3 { return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }; }
function dimensionLocation(dimension: Dimension, location: Vector3): DimensionLocation { return { dimension, x: location.x, y: location.y, z: location.z }; }

export const Vec3 = /* @__PURE__ */ makeVec(VECTOR3_KEYS, { up, down, cross, dimensionLocation });

// ---------------------------------------------------------------------------
// Vector2 — same treatment
// ---------------------------------------------------------------------------

function up2(a = 1): Vector2 { return { x: 0, y: a }; }
function down2(a = 1): Vector2 { return { x: 0, y: -a }; }
function cross2(a: Vector2, b: Vector2): number { return a.x * b.y - a.y * b.x; }

export const Vec2 = /* @__PURE__ */ makeVec(VECTOR2_KEYS, { up: up2, down: down2, cross: cross2 });

// ---------------------------------------------------------------------------
// VectorXZ — same treatment
// ---------------------------------------------------------------------------

function crossXZ(a: VectorXZ, b: VectorXZ): number { return a.x * b.z - a.z * b.x; }

export const VecXZ = /* @__PURE__ */ makeVec(VECTORXZ_KEYS, { cross: crossXZ });