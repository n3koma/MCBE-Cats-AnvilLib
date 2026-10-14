import type { Dimension, DimensionLocation, Vector3, Vector2, VectorXZ } from "@minecraft/server";

type VectorKeys<K extends string> = Record<K, number>;

function create<K extends string>(keys: readonly K[], values: Record<K, number>): VectorKeys<K> {
	const result = {} as VectorKeys<K>;
	for (const key of keys) result[key] = values[key];
	return result;
}

function zipMap<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>, fn: (x: number, y: number) => number): VectorKeys<K> {
	return create(keys, Object.fromEntries(keys.map(key => [key, fn(a[key], b[key])])) as Record<K, number>);
}

function mapEach<K extends string>(keys: readonly K[], value: VectorKeys<K>, fn: (x: number) => number): VectorKeys<K> {
	return create(keys, Object.fromEntries(keys.map(key => [key, fn(value[key])])) as Record<K, number>);
}

function equal<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): boolean {
	return v.every(vec => keys.every(key => vec[key] === v[0][key]));
}

function add<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	return v.reduce((acc, curr) => zipMap(keys, acc, curr, (x, y) => x + y), splat(keys, 0));
}

function subtract<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): VectorKeys<K> {
	return zipMap(keys, a, b, (x, y) => x - y);
}

function multiply<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	return v.reduce((acc, curr) => zipMap(keys, acc, curr, (x, y) => x * y), splat(keys, 1));
}

function divide<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): VectorKeys<K> {
	return zipMap(keys, a, b, (x, y) => x / y);
}

function scale<K extends string>(keys: readonly K[], value: VectorKeys<K>, scalar: number): VectorKeys<K> {
	return mapEach(keys, value, x => x * scalar);
}

function zero<K extends string>(keys: readonly K[]): VectorKeys<K> {
	return splat(keys, 0);
}

function one<K extends string>(keys: readonly K[]): VectorKeys<K> {
	return splat(keys, 1);
}

function max<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	return v.reduce((acc, curr) => zipMap(keys, acc, curr, Math.max), splat(keys, -Infinity));
}

function min<K extends string>(keys: readonly K[], ...v: VectorKeys<K>[]): VectorKeys<K> {
	return v.reduce((acc, curr) => zipMap(keys, acc, curr, Math.min), splat(keys, Infinity));
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
	return create(keys, Object.fromEntries(keys.map(key => [key, value])) as Record<K, number>);
}

function random<K extends string>(keys: readonly K[], minValue = 0, maxValue = 1): VectorKeys<K> {
	return create(keys, Object.fromEntries(keys.map(key => [key, Math.random() * (maxValue - minValue) + minValue])) as Record<K, number>);
}

function lenSq<K extends string>(keys: readonly K[], value: VectorKeys<K>): number {
	return keys.reduce((sum, key) => sum + value[key] * value[key], 0);
}

function len<K extends string>(keys: readonly K[], value: VectorKeys<K>): number {
	return Math.sqrt(lenSq(keys, value));
}

function normalize<K extends string>(keys: readonly K[], value: VectorKeys<K>): VectorKeys<K> {
	const length = len(keys, value);
	return length === 0 ? splat(keys, 0) : mapEach(keys, value, x => x / length);
}

function distance<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): number {
	return len(keys, subtract(keys, a, b));
}

function distanceSq<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): number {
	return lenSq(keys, subtract(keys, a, b));
}

function dot<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>): number {
	return keys.reduce((sum, key) => sum + a[key] * b[key], 0);
}

function lerp<K extends string>(keys: readonly K[], a: VectorKeys<K>, b: VectorKeys<K>, t: number): VectorKeys<K> {
	return zipMap(keys, a, b, (x, y) => x + (y - x) * t);
}

function inRange<K extends string>(keys: readonly K[], value: VectorKeys<K>, from: VectorKeys<K>, to: VectorKeys<K>): boolean {
	return keys.every(key => value[key] >= Math.min(from[key], to[key]) && value[key] <= Math.max(from[key], to[key]));
}

function isVectorType<K extends string>(keys: readonly K[], value: unknown): value is VectorKeys<K> {
	return typeof value === "object" && value !== null && keys.every(key => typeof (value as Record<string, unknown>)[key] === "number");
}

const VECTOR3_KEYS = ["x", "y", "z"] as const;
const VECTOR2_KEYS = ["x", "y"] as const;
const VECTORXZ_KEYS = ["x", "z"] as const;

// ---------------------------------------------------------------------------
// Vector3 — private wrappers, exposed only through the Vec3 namespace object
// ---------------------------------------------------------------------------

function up(a = 1): Vector3 { return { x: 0, y: a, z: 0 }; }
function down(a = 1): Vector3 { return { x: 0, y: -a, z: 0 }; }
function cross(a: Vector3, b: Vector3): Vector3 { return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }; }
function dimensionLocation(dimension: Dimension, location: Vector3): DimensionLocation { return { dimension, x: location.x, y: location.y, z: location.z }; }

export const Vec3 = {
	create: (values: Vector3) => create(VECTOR3_KEYS, values),
	equal: (...v: Vector3[]) => equal(VECTOR3_KEYS, ...v),
	add: (...v: Vector3[]) => add(VECTOR3_KEYS, ...v),
	subtract: (a: Vector3, b: Vector3) => subtract(VECTOR3_KEYS, a, b),
	multiply: (...v: Vector3[]) => multiply(VECTOR3_KEYS, ...v),
	divide: (a: Vector3, b: Vector3) => divide(VECTOR3_KEYS, a, b),
	scale: (value: Vector3, scalar: number) => scale(VECTOR3_KEYS, value, scalar),
	zero: () => zero(VECTOR3_KEYS),
	one: () => one(VECTOR3_KEYS),
	max: (...v: Vector3[]) => max(VECTOR3_KEYS, ...v),
	min: (...v: Vector3[]) => min(VECTOR3_KEYS, ...v),
	floor: (value: Vector3) => floor(VECTOR3_KEYS, value),
	ceil: (value: Vector3) => ceil(VECTOR3_KEYS, value),
	round: (value: Vector3) => round(VECTOR3_KEYS, value),
	splat: (value = 1) => splat(VECTOR3_KEYS, value),
	random: (minValue = 0, maxValue = 1) => random(VECTOR3_KEYS, minValue, maxValue),
	lenSq: (value: Vector3) => lenSq(VECTOR3_KEYS, value),
	len: (value: Vector3) => len(VECTOR3_KEYS, value),
	normalize: (value: Vector3) => normalize(VECTOR3_KEYS, value),
	distance: (a: Vector3, b: Vector3) => distance(VECTOR3_KEYS, a, b),
	distanceSq: (a: Vector3, b: Vector3) => distanceSq(VECTOR3_KEYS, a, b),
	dot: (a: Vector3, b: Vector3) => dot(VECTOR3_KEYS, a, b),
	lerp: (a: Vector3, b: Vector3, t: number) => lerp(VECTOR3_KEYS, a, b, t),
	in: (value: Vector3, from: Vector3, to: Vector3) => inRange(VECTOR3_KEYS, value, from, to),
	is: (value: unknown): value is Vector3 => isVectorType(VECTOR3_KEYS, value),
	up,
	down,
	cross,
	dimensionLocation,
} as const;

// ---------------------------------------------------------------------------
// Vector2 — same treatment
// ---------------------------------------------------------------------------

function up2(a = 1): Vector2 { return { x: 0, y: a }; }
function down2(a = 1): Vector2 { return { x: 0, y: -a }; }
function cross2(a: Vector2, b: Vector2): number { return a.x * b.y - a.y * b.x; }

export const Vec2 = {
	create: (values: Vector2) => create(VECTOR2_KEYS, values),
	equal: (...v: Vector2[]) => equal(VECTOR2_KEYS, ...v),
	add: (...v: Vector2[]) => add(VECTOR2_KEYS, ...v),
	subtract: (a: Vector2, b: Vector2) => subtract(VECTOR2_KEYS, a, b),
	multiply: (...v: Vector2[]) => multiply(VECTOR2_KEYS, ...v),
	divide: (a: Vector2, b: Vector2) => divide(VECTOR2_KEYS, a, b),
	scale: (value: Vector2, scalar: number) => scale(VECTOR2_KEYS, value, scalar),
	zero: () => zero(VECTOR2_KEYS),
	one: () => one(VECTOR2_KEYS),
	max: (...v: Vector2[]) => max(VECTOR2_KEYS, ...v),
	min: (...v: Vector2[]) => min(VECTOR2_KEYS, ...v),
	floor: (value: Vector2) => floor(VECTOR2_KEYS, value),
	ceil: (value: Vector2) => ceil(VECTOR2_KEYS, value),
	round: (value: Vector2) => round(VECTOR2_KEYS, value),
	splat: (value = 1) => splat(VECTOR2_KEYS, value),
	random: (minValue = 0, maxValue = 1) => random(VECTOR2_KEYS, minValue, maxValue),
	lenSq: (value: Vector2) => lenSq(VECTOR2_KEYS, value),
	len: (value: Vector2) => len(VECTOR2_KEYS, value),
	normalize: (value: Vector2) => normalize(VECTOR2_KEYS, value),
	distance: (a: Vector2, b: Vector2) => distance(VECTOR2_KEYS, a, b),
	distanceSq: (a: Vector2, b: Vector2) => distanceSq(VECTOR2_KEYS, a, b),
	dot: (a: Vector2, b: Vector2) => dot(VECTOR2_KEYS, a, b),
	lerp: (a: Vector2, b: Vector2, t: number) => lerp(VECTOR2_KEYS, a, b, t),
	in: (value: Vector2, from: Vector2, to: Vector2) => inRange(VECTOR2_KEYS, value, from, to),
	is: (value: unknown): value is Vector2 => isVectorType(VECTOR2_KEYS, value),
	up: up2,
	down: down2,
	cross: cross2,
} as const;

// ---------------------------------------------------------------------------
// VectorXZ — same treatment
// ---------------------------------------------------------------------------

function crossXZ(a: VectorXZ, b: VectorXZ): number { return a.x * b.z - a.z * b.x; }

export const VecXZ = {
	create: (values: VectorXZ) => create(VECTORXZ_KEYS, values),
	equal: (...v: VectorXZ[]) => equal(VECTORXZ_KEYS, ...v),
	add: (...v: VectorXZ[]) => add(VECTORXZ_KEYS, ...v),
	subtract: (a: VectorXZ, b: VectorXZ) => subtract(VECTORXZ_KEYS, a, b),
	multiply: (...v: VectorXZ[]) => multiply(VECTORXZ_KEYS, ...v),
	divide: (a: VectorXZ, b: VectorXZ) => divide(VECTORXZ_KEYS, a, b),
	scale: (value: VectorXZ, scalar: number) => scale(VECTORXZ_KEYS, value, scalar),
	zero: () => zero(VECTORXZ_KEYS),
	one: () => one(VECTORXZ_KEYS),
	max: (...v: VectorXZ[]) => max(VECTORXZ_KEYS, ...v),
	min: (...v: VectorXZ[]) => min(VECTORXZ_KEYS, ...v),
	floor: (value: VectorXZ) => floor(VECTORXZ_KEYS, value),
	ceil: (value: VectorXZ) => ceil(VECTORXZ_KEYS, value),
	round: (value: VectorXZ) => round(VECTORXZ_KEYS, value),
	splat: (value = 1) => splat(VECTORXZ_KEYS, value),
	random: (minValue = 0, maxValue = 1) => random(VECTORXZ_KEYS, minValue, maxValue),
	lenSq: (value: VectorXZ) => lenSq(VECTORXZ_KEYS, value),
	len: (value: VectorXZ) => len(VECTORXZ_KEYS, value),
	normalize: (value: VectorXZ) => normalize(VECTORXZ_KEYS, value),
	distance: (a: VectorXZ, b: VectorXZ) => distance(VECTORXZ_KEYS, a, b),
	distanceSq: (a: VectorXZ, b: VectorXZ) => distanceSq(VECTORXZ_KEYS, a, b),
	dot: (a: VectorXZ, b: VectorXZ) => dot(VECTORXZ_KEYS, a, b),
	lerp: (a: VectorXZ, b: VectorXZ, t: number) => lerp(VECTORXZ_KEYS, a, b, t),
	in: (value: VectorXZ, from: VectorXZ, to: VectorXZ) => inRange(VECTORXZ_KEYS, value, from, to),
	is: (value: unknown): value is VectorXZ => isVectorType(VECTORXZ_KEYS, value),
	cross: crossXZ,
} as const;