import base from "./base.js"
import jsdoc from "./jsdoc.js"
import namingConventions from "./naming-conventions.js"
import performance from "./performance.js"
import sortKeys from "./sort-keys.js"
import strictExports from "./strict-exports.js"
import styleGuide from "./style-guide.js"
import typeChecks from "./type-checks.js"

export default {
  configs: {
    /**
     * Base TypeScript configuration with parser and plugin setup.
     * Required for all other configs to work.
     */
    base,

    /**
     * JSDoc validation rules (alignment, tag names, formatting).
     * Use for code with public APIs or documentation requirements.
     */
    jsdoc,

    /**
     * TypeScript naming conventions (PascalCase for types, camelCase for
     * properties, etc). Requires type information.
     */
    namingConventions,

    /**
     * Import optimizations for library code (consistent type imports, no side
     * effects). Use for packages consumed by other projects.
     */
    performance,

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
    recommended: [base, styleGuide, sortKeys, typeChecks, namingConventions],

    /**
     * Sort object properties, interface members, and type definitions
     * alphabetically.
     */
    sortKeys,

    /**
     * Enforce explicit type exports for public APIs (prevents runtime bloat).
     * Use for library entry points and public exports.
     */
    strictExports,

    /**
     * Code style rules (imports, formatting, unused code, etc).
     * Enforces Prettier, import ordering, and code quality standards.
     */
    styleGuide,

    /**
     * Type-aware linting rules (await-thenable, no-unsafe-call, etc).
     * Requires TypeScript type information. Catches type-related bugs.
     */
    typeChecks,
  },
}
