import type {ConfigObject} from "@eslint/core"

interface ReactConfigExport {
  configs: {
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
    recommended: ConfigObject[]

    /**
     * Strict settings for React compiler compatibility and enforcement of React
     * best practices. Use alongside {@link recommended}.
     */
    strict: ConfigObject[]
  }
}

declare const reactConfig: ReactConfigExport
export default reactConfig
