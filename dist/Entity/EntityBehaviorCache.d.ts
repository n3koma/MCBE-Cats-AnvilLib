import { Entity } from "@minecraft/server";
/**
 * 特定のtypeIdをキャッシュ対象として登録する。
 * 既にワールドが初期化済みなら即座にそのタイプも初期スキャンする。
 */
export declare function registerBehaviorCache(typeId: string): void;
/** ワールド起動後に一度だけ呼ぶ。登録済みの全タイプを初期スキャンする */
export declare function initializeBehaviorCache(): void;
export declare function getBehaviorCache(typeId: string): Entity[];
