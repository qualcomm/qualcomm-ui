import type {ConfigObject} from "@eslint/core"

interface TypescriptConfigExport {
  configs: {
    /**
     * Base TypeScript configuration with parser and plugin setup.
     * Required for each config to work.
     */
    base: ConfigObject

    /**
     * JSDoc validation rules (alignment, tag names, formatting).
     * Use for code with public APIs or documentation requirements.
     */
    jsdoc: ConfigObject

    /**
     * TypeScript naming conventions (PascalCase for types, camelCase for
     * properties, etc). Requires type information.
     */
    namingConventions: ConfigObject

    /**
     * Import optimizations for library code (consistent type imports, no side
     * effects). Use for packages consumed by other projects.
     */
    performance: ConfigObject

    /**
     * Array of recommended configs. This is equivalent to the following:
     * ```js
     * import qui from "@qualcomm-ui/eslint-config-typescript"
     *
     * const recommended = [
     *   qui.configs.base,
     *   qui.configs.styleGuide,
     *   qui.configs.sortKeys,
     *   qui.configs.typeChecks,
     *   qui.configs.namingConventions,
     * ]
     * ```
     *
     * Usage:
     *
     * @example
     * ```js
     * // eslint.config.js
     * import {defineConfig} from "eslint/config"
     * import quiEslintTs from "@qualcomm-ui/eslint-config-typescript"
     *
     * export default defineConfig(
     *  {
     *    // other settings
     *  },
     *  {
     *    extends: [...quiEslintTs.configs.recommended],
     *    files: [/*TS Files*\/]
     *  },
     * )
     * ```
     */
    recommended: ConfigObject[]

    /**
     * Sort object properties, interface members, and type definitions
     * alphabetically.
     */
    sortKeys: ConfigObject

    /**
     * Enforce explicit type exports for public APIs (prevents runtime bloat).
     * Use for library entry points and public exports.
     */
    strictExports: ConfigObject

    /**
     * Code style rules (imports, formatting, unused code, etc).
     * Enforces Prettier, import ordering, and code quality standards.
     */
    styleGuide: ConfigObject

    /**
     * Type-aware linting rules (await-thenable, no-unsafe-call, etc).
     * Requires TypeScript type information. Catches type-related bugs.
     */
    typeChecks: ConfigObject
  }
}

declare const typescriptConfig: TypescriptConfigExport
export default typescriptConfig
