function create(keys, values) {
    const result = {};
    for (const key of keys)
        result[key] = values[key];
    return result;
}
function zipMap(keys, a, b, fn) {
    return create(keys, Object.fromEntries(keys.map(key => [key, fn(a[key], b[key])])));
}
function mapEach(keys, value, fn) {
    return create(keys, Object.fromEntries(keys.map(key => [key, fn(value[key])])));
}
function equal(keys, ...v) {
    return v.every(vec => keys.every(key => vec[key] === v[0][key]));
}
function add(keys, ...v) {
    return v.reduce((acc, curr) => zipMap(keys, acc, curr, (x, y) => x + y), splat(keys, 0));
}
function subtract(keys, a, b) {
    return zipMap(keys, a, b, (x, y) => x - y);
}
function multiply(keys, ...v) {
    return v.reduce((acc, curr) => zipMap(keys, acc, curr, (x, y) => x * y), splat(keys, 1));
}
function divide(keys, a, b) {
    return zipMap(keys, a, b, (x, y) => x / y);
}
function scale(keys, value, scalar) {
    return mapEach(keys, value, x => x * scalar);
}
function zero(keys) {
    return splat(keys, 0);
}
function one(keys) {
    return splat(keys, 1);
}
function max(keys, ...v) {
    return v.reduce((acc, curr) => zipMap(keys, acc, curr, Math.max), splat(keys, -Infinity));
}
function min(keys, ...v) {
    return v.reduce((acc, curr) => zipMap(keys, acc, curr, Math.min), splat(keys, Infinity));
}
function floor(keys, value) {
    return mapEach(keys, value, Math.floor);
}
function ceil(keys, value) {
    return mapEach(keys, value, Math.ceil);
}
function round(keys, value) {
    return mapEach(keys, value, Math.round);
}
function splat(keys, value = 1) {
    return create(keys, Object.fromEntries(keys.map(key => [key, value])));
}
function random(keys, minValue = 0, maxValue = 1) {
    return create(keys, Object.fromEntries(keys.map(key => [key, Math.random() * (maxValue - minValue) + minValue])));
}
function lenSq(keys, value) {
    return keys.reduce((sum, key) => sum + value[key] * value[key], 0);
}
function len(keys, value) {
    return Math.sqrt(lenSq(keys, value));
}
function normalize(keys, value) {
    const length = len(keys, value);
    return length === 0 ? splat(keys, 0) : mapEach(keys, value, x => x / length);
}
function distance(keys, a, b) {
    return len(keys, subtract(keys, a, b));
}
function distanceSq(keys, a, b) {
    return lenSq(keys, subtract(keys, a, b));
}
function dot(keys, a, b) {
    return keys.reduce((sum, key) => sum + a[key] * b[key], 0);
}
function lerp(keys, a, b, t) {
    return zipMap(keys, a, b, (x, y) => x + (y - x) * t);
}
function inRange(keys, value, from, to) {
    return keys.every(key => value[key] >= Math.min(from[key], to[key]) && value[key] <= Math.max(from[key], to[key]));
}
function isVectorType(keys, value) {
    return typeof value === "object" && value !== null && keys.every(key => typeof value[key] === "number");
}
const VECTOR3_KEYS = ["x", "y", "z"];
const VECTOR2_KEYS = ["x", "y"];
const VECTORXZ_KEYS = ["x", "z"];
// ---------------------------------------------------------------------------
// Vector3 — private wrappers, exposed only through the Vec3 namespace object
// ---------------------------------------------------------------------------
function up(a = 1) { return { x: 0, y: a, z: 0 }; }
function down(a = 1) { return { x: 0, y: -a, z: 0 }; }
function cross(a, b) { return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }; }
function dimensionLocation(dimension, location) { return { dimension, x: location.x, y: location.y, z: location.z }; }
export const Vec3 = {
    create: (values) => create(VECTOR3_KEYS, values),
    equal: (...v) => equal(VECTOR3_KEYS, ...v),
    add: (...v) => add(VECTOR3_KEYS, ...v),
    subtract: (a, b) => subtract(VECTOR3_KEYS, a, b),
    multiply: (...v) => multiply(VECTOR3_KEYS, ...v),
    divide: (a, b) => divide(VECTOR3_KEYS, a, b),
    scale: (value, scalar) => scale(VECTOR3_KEYS, value, scalar),
    zero: () => zero(VECTOR3_KEYS),
    one: () => one(VECTOR3_KEYS),
    max: (...v) => max(VECTOR3_KEYS, ...v),
    min: (...v) => min(VECTOR3_KEYS, ...v),
    floor: (value) => floor(VECTOR3_KEYS, value),
    ceil: (value) => ceil(VECTOR3_KEYS, value),
    round: (value) => round(VECTOR3_KEYS, value),
    splat: (value = 1) => splat(VECTOR3_KEYS, value),
    random: (minValue = 0, maxValue = 1) => random(VECTOR3_KEYS, minValue, maxValue),
    lenSq: (value) => lenSq(VECTOR3_KEYS, value),
    len: (value) => len(VECTOR3_KEYS, value),
    normalize: (value) => normalize(VECTOR3_KEYS, value),
    distance: (a, b) => distance(VECTOR3_KEYS, a, b),
    distanceSq: (a, b) => distanceSq(VECTOR3_KEYS, a, b),
    dot: (a, b) => dot(VECTOR3_KEYS, a, b),
    lerp: (a, b, t) => lerp(VECTOR3_KEYS, a, b, t),
    in: (value, from, to) => inRange(VECTOR3_KEYS, value, from, to),
    is: (value) => isVectorType(VECTOR3_KEYS, value),
    up,
    down,
    cross,
    dimensionLocation,
};
// ---------------------------------------------------------------------------
// Vector2 — same treatment
// ---------------------------------------------------------------------------
function up2(a = 1) { return { x: 0, y: a }; }
function down2(a = 1) { return { x: 0, y: -a }; }
function cross2(a, b) { return a.x * b.y - a.y * b.x; }
export const Vec2 = {
    create: (values) => create(VECTOR2_KEYS, values),
    equal: (...v) => equal(VECTOR2_KEYS, ...v),
    add: (...v) => add(VECTOR2_KEYS, ...v),
    subtract: (a, b) => subtract(VECTOR2_KEYS, a, b),
    multiply: (...v) => multiply(VECTOR2_KEYS, ...v),
    divide: (a, b) => divide(VECTOR2_KEYS, a, b),
    scale: (value, scalar) => scale(VECTOR2_KEYS, value, scalar),
    zero: () => zero(VECTOR2_KEYS),
    one: () => one(VECTOR2_KEYS),
    max: (...v) => max(VECTOR2_KEYS, ...v),
    min: (...v) => min(VECTOR2_KEYS, ...v),
    floor: (value) => floor(VECTOR2_KEYS, value),
    ceil: (value) => ceil(VECTOR2_KEYS, value),
    round: (value) => round(VECTOR2_KEYS, value),
    splat: (value = 1) => splat(VECTOR2_KEYS, value),
    random: (minValue = 0, maxValue = 1) => random(VECTOR2_KEYS, minValue, maxValue),
    lenSq: (value) => lenSq(VECTOR2_KEYS, value),
    len: (value) => len(VECTOR2_KEYS, value),
    normalize: (value) => normalize(VECTOR2_KEYS, value),
    distance: (a, b) => distance(VECTOR2_KEYS, a, b),
    distanceSq: (a, b) => distanceSq(VECTOR2_KEYS, a, b),
    dot: (a, b) => dot(VECTOR2_KEYS, a, b),
    lerp: (a, b, t) => lerp(VECTOR2_KEYS, a, b, t),
    in: (value, from, to) => inRange(VECTOR2_KEYS, value, from, to),
    is: (value) => isVectorType(VECTOR2_KEYS, value),
    up: up2,
    down: down2,
    cross: cross2,
};
// ---------------------------------------------------------------------------
// VectorXZ — same treatment
// ---------------------------------------------------------------------------
function crossXZ(a, b) { return a.x * b.z - a.z * b.x; }
export const VecXZ = {
    create: (values) => create(VECTORXZ_KEYS, values),
    equal: (...v) => equal(VECTORXZ_KEYS, ...v),
    add: (...v) => add(VECTORXZ_KEYS, ...v),
    subtract: (a, b) => subtract(VECTORXZ_KEYS, a, b),
    multiply: (...v) => multiply(VECTORXZ_KEYS, ...v),
    divide: (a, b) => divide(VECTORXZ_KEYS, a, b),
    scale: (value, scalar) => scale(VECTORXZ_KEYS, value, scalar),
    zero: () => zero(VECTORXZ_KEYS),
    one: () => one(VECTORXZ_KEYS),
    max: (...v) => max(VECTORXZ_KEYS, ...v),
    min: (...v) => min(VECTORXZ_KEYS, ...v),
    floor: (value) => floor(VECTORXZ_KEYS, value),
    ceil: (value) => ceil(VECTORXZ_KEYS, value),
    round: (value) => round(VECTORXZ_KEYS, value),
    splat: (value = 1) => splat(VECTORXZ_KEYS, value),
    random: (minValue = 0, maxValue = 1) => random(VECTORXZ_KEYS, minValue, maxValue),
    lenSq: (value) => lenSq(VECTORXZ_KEYS, value),
    len: (value) => len(VECTORXZ_KEYS, value),
    normalize: (value) => normalize(VECTORXZ_KEYS, value),
    distance: (a, b) => distance(VECTORXZ_KEYS, a, b),
    distanceSq: (a, b) => distanceSq(VECTORXZ_KEYS, a, b),
    dot: (a, b) => dot(VECTORXZ_KEYS, a, b),
    lerp: (a, b, t) => lerp(VECTORXZ_KEYS, a, b, t),
    in: (value, from, to) => inRange(VECTORXZ_KEYS, value, from, to),
    is: (value) => isVectorType(VECTORXZ_KEYS, value),
    cross: crossXZ,
};
