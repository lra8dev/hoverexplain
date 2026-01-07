import antfu from "@antfu/eslint-config";

/**
 * Create a customized ESLint config based on `@antfu/eslint-config`
 * @param  options - Configuration options
 * @param userConfigs - Additional user configs
 */
export function createConfig(options = {}, ...userConfigs) {
  return antfu(
    {
      type: "app",
      typescript: true,
      formatters: true,
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
      ...options,
    },
    {
      rules: {
        "ts/consistent-type-definitions": ["error", "type"],
        "no-console": ["warn"],
        "antfu/no-top-level-await": ["off"],
        "node/prefer-global/process": ["off"],
        "node/no-process-env": ["error"],
        "perfectionist/sort-imports": [
          "error",
          {
            tsconfigRootDir: ".",
          },
        ],
        "unicorn/filename-case": [
          "error",
          {
            case: "kebabCase",
            ignore: ["dist", "node_modules"],
          },
        ],
      },
    },
    ...userConfigs
  );
}

/** Default config export for simple usage */
export default createConfig();
