export class DynamicPropertyReader {
    constructor(value) {
        this.value = value;
    }
    asString(defaultValue) {
        if (typeof this.value !== "string")
            return defaultValue;
        return this.value;
    }
    asNumber(defaultValue) {
        if (typeof this.value !== "number")
            return defaultValue;
        return this.value;
    }
    asBoolean(defaultValue) {
        if (typeof this.value !== "boolean")
            return defaultValue;
        return this.value;
    }
    asVector3(defaultValue) {
        if (typeof this.value !== "object" || this.value === null)
            return defaultValue;
        const { x, y, z } = this.value;
        if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number")
            return defaultValue;
        return { x, y, z };
    }
    static fromItemStack(itemStack, dynamicId) {
        const value = itemStack.getDynamicProperty(dynamicId);
        return new DynamicPropertyReader(value);
    }
    static fromEntity(entity, dynamicId) {
        const value = entity.getDynamicProperty(dynamicId);
        return new DynamicPropertyReader(value);
    }
    static fromValue(value) {
        return new DynamicPropertyReader(value);
    }
}
