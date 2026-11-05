function create(keys, values) {
    const result = {};
    for (const key of keys)
        result[key] = values[key];
    return result;
}
function zipMap(keys, a, b, fn) {
    const r = {};
    for (const k of keys)
        r[k] = fn(a[k], b[k]);
    return r;
}
function mapEach(keys, value, fn) {
    const r = {};
    for (const k of keys)
        r[k] = fn(value[k]);
    return r;
}
function equal(keys, ...v) {
    return v.every(vec => keys.every(key => vec[key] === v[0][key]));
}
function add(keys, ...v) {
    const r = splat(keys, 0);
    for (const vec of v)
        for (const k of keys)
            r[k] += vec[k];
    return r;
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
    const r = {};
    for (const k of keys)
        r[k] = value;
    return r;
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
function distanceSq(keys, a, b) {
    let s = 0;
    for (const k of keys) {
        const d = a[k] - b[k];
        s += d * d;
    }
    return s;
}
function distance(keys, a, b) {
    return Math.sqrt(distanceSq(keys, a, b));
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
function makeVec(keys, extra) {
    return {
        create: (values) => create(keys, values),
        equal: (...v) => equal(keys, ...v),
        add: (...v) => add(keys, ...v),
        subtract: (a, b) => subtract(keys, a, b),
        multiply: (...v) => multiply(keys, ...v),
        divide: (a, b) => divide(keys, a, b),
        scale: (value, scalar) => scale(keys, value, scalar),
        zero: () => zero(keys),
        one: () => one(keys),
        max: (...v) => max(keys, ...v),
        min: (...v) => min(keys, ...v),
        floor: (value) => floor(keys, value),
        ceil: (value) => ceil(keys, value),
        round: (value) => round(keys, value),
        splat: (value = 1) => splat(keys, value),
        random: (minValue = 0, maxValue = 1) => random(keys, minValue, maxValue),
        lenSq: (value) => lenSq(keys, value),
        len: (value) => len(keys, value),
        normalize: (value) => normalize(keys, value),
        distance: (a, b) => distance(keys, a, b),
        distanceSq: (a, b) => distanceSq(keys, a, b),
        dot: (a, b) => dot(keys, a, b),
        lerp: (a, b, t) => lerp(keys, a, b, t),
        in: (value, from, to) => inRange(keys, value, from, to),
        is: (value) => isVectorType(keys, value),
        ...extra,
    };
}
// ---------------------------------------------------------------------------
// Vector3 — private wrappers, exposed only through the Vec3 namespace object
// ---------------------------------------------------------------------------
function up(a = 1) { return { x: 0, y: a, z: 0 }; }
function down(a = 1) { return { x: 0, y: -a, z: 0 }; }
function cross(a, b) { return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }; }
function dimensionLocation(dimension, location) { return { dimension, x: location.x, y: location.y, z: location.z }; }
export const Vec3 = /* @__PURE__ */ makeVec(VECTOR3_KEYS, { up, down, cross, dimensionLocation });
// ---------------------------------------------------------------------------
// Vector2 — same treatment
// ---------------------------------------------------------------------------
function up2(a = 1) { return { x: 0, y: a }; }
function down2(a = 1) { return { x: 0, y: -a }; }
function cross2(a, b) { return a.x * b.y - a.y * b.x; }
export const Vec2 = /* @__PURE__ */ makeVec(VECTOR2_KEYS, { up: up2, down: down2, cross: cross2 });
// ---------------------------------------------------------------------------
// VectorXZ — same treatment
// ---------------------------------------------------------------------------
function crossXZ(a, b) { return a.x * b.z - a.z * b.x; }
export const VecXZ = /* @__PURE__ */ makeVec(VECTORXZ_KEYS, { cross: crossXZ });
