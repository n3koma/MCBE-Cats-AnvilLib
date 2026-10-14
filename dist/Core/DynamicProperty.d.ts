import { Entity, ItemStack, Vector3 } from "@minecraft/server";
export type DynamicPropertyValue = ReturnType<typeof ItemStack.prototype.getDynamicProperty> | ReturnType<typeof Entity.prototype.getDynamicProperty>;
export declare class DynamicPropertyReader {
    private readonly value;
    constructor(value: DynamicPropertyValue);
    asString<T>(defaultValue: T): string | T;
    asNumber<T>(defaultValue: T): number | T;
    asBoolean<T>(defaultValue: T): boolean | T;
    asVector3<T>(defaultValue: T): Vector3 | T;
    static fromItemStack(itemStack: ItemStack, dynamicId: string): DynamicPropertyReader;
    static fromEntity(entity: Entity, dynamicId: string): DynamicPropertyReader;
    static fromValue(value: DynamicPropertyValue): DynamicPropertyReader;
}
