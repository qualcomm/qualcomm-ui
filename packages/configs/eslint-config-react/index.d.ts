import type {ConfigObject} from "@eslint/core"

interface ReactConfigExport {
  configs: {
    /**
     * Base React configuration with plugins and settings.
     * Required for the {@link recommended} and {@link strict} configs to work.
     */
    base: ConfigObject

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
    recommended: ConfigObject

    /**
     * Strict settings for React compiler compatibility and enforcement of React
     * best practices. Use alongside `recommended`.
     */
    strict: ConfigObject
  }
}

declare const reactConfig: ReactConfigExport
export default reactConfig
