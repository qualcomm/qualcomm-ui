const __dirname = dirname(fileURLToPath(import.meta.url))

for (const pkgName of [
  "eslint-config-mdx",
  "eslint-plugin-angular",
  "eslint-plugin-react",
]) {
  assert.ok(
    existsSync(resolve(__dirname, `packages/configs/${pkgName}/dist/index.js`)),
    `@qualcomm-ui/${pkgName} must be built`,
  )
}

import {defineConfig} from "eslint/config"
import assert from "node:assert"
import {existsSync} from "node:fs"
import {dirname, join, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import tseslint from "typescript-eslint"

import quiEslintAngular from "@qualcomm-ui/eslint-config-angular"
import quiEslintMdx from "@qualcomm-ui/eslint-config-mdx"
import quiEslintReact from "@qualcomm-ui/eslint-config-react"
import quiEslintTs from "@qualcomm-ui/eslint-config-typescript"
import quiEslintPluginAngular from "@qualcomm-ui/eslint-plugin-angular"
import quiPathAlias from "@qualcomm-ui/eslint-plugin-path-alias"
import quiEslintPluginReact from "@qualcomm-ui/eslint-plugin-react"

const languageOptions = {
  parser: tseslint.parser,
  parserOptions: {
    projectService: true,
  },
}

export default defineConfig(
  {
    ignores: [
      "**/.angular/",
      "**/.nx/",
      "**/.nyc-output/",
      "**/.react-router/",
      "**/.turbo/",
      "**/.sst/",
      "**/build/",
      "**/coverage/",
      "**/dist/",
      "**/node_modules/",
      "**/out/",
      "**/out-tsc/",
      "**/vite.config.ts.timestamp*",
      "./packages/docs/**/src/routes/changelogs.*",
      "./packages/docs/angular*/public/*.js",
      "./packages/common/codemod/src/**/__tests__/mocks/**/*.tsx",
      "**/temp/",
      "**/public/exports/**",
      "**/frameworks/react-internal/files/component-list.md",
      "packages/docs/*/knowledge/**",
      "**/generated/**",
      "packages/**/qui-env.d.ts",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        EventListenerOrEventListenerObject: true,
        FocusOptions: true,
        JSX: true,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      sourceType: "module",
    },
  },
  {
    extends: [quiEslintTs.configs.recommended],
    files: ["scripts/*.ts"],
  },
  {
    extends: [quiEslintTs.configs.sortKeys, quiEslintTs.configs.styleGuide],
    files: [
      "{packages,scripts}/**/*.{jsx,js,mjs,cjs}",
      "*.{jsx,js,mjs.cjs}",
      ".github/actions/turborepo-remote-cache/action/*.{js,mjs,ts}",
      ".changeset/*.cjs",
    ],
  },

  // angular
  {
    extends: [
      quiEslintTs.configs.recommended,
      quiEslintAngular.configs.typescriptRecommended,
      quiEslintPluginAngular.config,
    ],
    files: [
      "packages/*/{angular,angular-*}/**/*.ts",
      "packages/docs/angular-docs/angular-demo-module/**/*.ts",
      "packages/docs/angular-docs/**/demos/**/*.ts",
      "packages/debug-apps/angular*/src/**/*.ts",
    ],
    rules: {
      "@angular-eslint/prefer-standalone": "off",
    },
  },
  {
    extends: [
      quiEslintTs.configs.recommended,
      quiEslintAngular.configs.typescriptRecommended,
    ],
    files: ["packages/*/{angular,angular-*}/**/*.ts"],
    ignores: [
      "packages/*/{angular,angular-*}/**/*.{component,directive,service,pipe,controller,spec}.ts",
      "packages/debug-apps/angular*/src/**/*.ts",
    ],
    languageOptions,
    rules: {
      "@angular-eslint/prefer-standalone": "off",
    },
  },
  {
    extends: [
      quiEslintAngular.configs.templateRecommended,
      quiEslintPluginAngular.config,
    ],
    files: [
      "packages/*/{angular,angular-*}/**/*.html",
      "packages/docs/angular-docs/**/demos/**/*.html",
      "packages/debug-apps/angular*/src/**/*.html",
    ],
  },

  // strict export config, enforces type-only exports
  {
    extends: [
      quiEslintTs.configs.recommended,
      quiEslintTs.configs.strictExports,
    ],
    files: ["{packages,scripts}/**/*.{ts,tsx}", "*.{ts,tsx}"],
    languageOptions,
  },

  // react docs and debug sites
  {
    extends: [
      quiEslintTs.configs.recommended,
      quiEslintReact.configs.recommended,
      quiEslintPluginReact.config,
    ],
    files: [
      "packages/docs/qui-site/**/*.{ts,tsx}",
      "packages/docs/qui-docs/**/*.{ts,tsx}",
      "packages/docs/react-docs/**/*.{ts,tsx}",
      "packages/docs/react-table-docs/**/*.{ts,tsx}",
      "packages/debug-apps/react-ssr/**/*.{ts,tsx}",
      "packages/docs/angular*/**/*.tsx",
    ],
    languageOptions,
  },

  {
    extends: [quiEslintReact.configs.recommended],
    files: ["packages/*/react-swagger/**/*.{ts,tsx}"],
    languageOptions,
    rules: {
      "@typescript-eslint/no-unsafe-function-type": "off",
      "react/prop-types": "off",
    },
  },

  {
    extends: [
      quiEslintTs.configs.recommended,
      quiEslintReact.configs.recommended,
      quiEslintReact.configs.strict,
    ],
    files: ["packages/frameworks/react*/**/*.{ts,tsx}"],
    ignores: ["packages/frameworks/react-swagger/**/*.{ts,tsx}"],
    languageOptions,
  },

  // path alias config
  {
    extends: [quiPathAlias.configs.recommended],
    files: [
      "packages/*/{angular-core,angular,core,dom,react-mdx,qds-core,react,react-core,utils}/**/*.{ts,tsx}",
    ],
    languageOptions,
  },

  {
    extends: [quiEslintMdx.configs.recommended],
    files: ["{packages,scripts}/**/*.{md,mdx}", "*.md"],
    ignores: ["**/CHANGELOG.md", "**/__tests__/**"],
    languageOptions: {
      parserOptions: {
        remarkConfigPath: join(
          import.meta.dirname,
          "node_modules/@qualcomm-ui/eslint-config-mdx/.remarkrc",
        ),
      },
    },
  },
)
