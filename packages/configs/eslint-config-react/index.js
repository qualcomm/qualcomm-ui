import base from "./base.js"
import recommended from "./recommended.js"
import strict from "./strict.js"

export default {
  configs: {
    /**
     * Base React configuration with plugins and settings.
     * Required for all other React configs to work.
     */
    base,

    /**
     * Recommended settings that every React project should use.
     * Includes base setup and recommended rules.
     *
     * @example
     * ```js
     * import {defineConfig} from "eslint/config"
     * import quiEslintReact from "@qualcomm-ui/eslint-config-react"
     *
     * export default defineConfig({
     *   extends: quiEslintReact.configs.recommended,
     *   files: ["**\/*.tsx"],
     * })
     * ```
     */
    recommended,

    /**
     * Strict settings for React compiler compatibility and enforcement of React
     * best practices. Use alongside `recommended`.
     */
    strict,
  },
}