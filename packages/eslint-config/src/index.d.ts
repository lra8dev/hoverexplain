import type antfu from "@antfu/eslint-config";
import type {
  Awaitable,
  OptionsConfig,
  TypedFlatConfigItem,
} from "@antfu/eslint-config";

type UserConfigItem = Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>;

/**
 * Create a customized ESLint config based on `@antfu/eslint-config`
 */
export declare function createConfig(
  options?: OptionsConfig,
  ...userConfigs: UserConfigItem[]
): ReturnType<typeof antfu>;

/**
 * Default config export for simple usage
 */
declare const _default: ReturnType<typeof antfu>;
export default _default;
