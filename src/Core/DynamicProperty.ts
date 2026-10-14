import { Entity, ItemStack, Vector3 } from "@minecraft/server";

export type DynamicPropertyValue =
 | ReturnType<typeof ItemStack.prototype.getDynamicProperty>
 | ReturnType<typeof Entity.prototype.getDynamicProperty>;

export class DynamicPropertyReader {
	constructor (
		private readonly value: DynamicPropertyValue,
	) {}

	asString<T>(defaultValue: T): string | T {
		if (typeof this.value !== "string") return defaultValue;
		return this.value as string;
	}

	asNumber<T>(defaultValue: T): number | T {
		if (typeof this.value !== "number") return defaultValue;
		return this.value as number;
	}

	asBoolean<T>(defaultValue: T): boolean | T {
		if (typeof this.value !== "boolean") return defaultValue;
		return this.value as boolean;
	}

	asVector3<T>(defaultValue: T): Vector3 | T {
		if (typeof this.value !== "object" || this.value === null) return defaultValue;
		const { x, y, z } = this.value as Vector3;
		if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number") return defaultValue;
		return { x, y, z };
	}

	static fromItemStack(itemStack: ItemStack, dynamicId: string): DynamicPropertyReader {
		const value = itemStack.getDynamicProperty(dynamicId);
		return new DynamicPropertyReader(value);
	}

	static fromEntity(entity: Entity, dynamicId: string): DynamicPropertyReader {
		const value = entity.getDynamicProperty(dynamicId);
		return new DynamicPropertyReader(value);
	}
	
	static fromValue(value: DynamicPropertyValue): DynamicPropertyReader {
		return new DynamicPropertyReader(value);
	}
}