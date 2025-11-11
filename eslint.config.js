import {defineConfig} from "eslint/config"
import tseslint from "typescript-eslint"

import quiEslintAngular from "@qualcomm-ui/eslint-config-angular"
import quiEslintMdx from "@qualcomm-ui/eslint-config-mdx"
import quiEslintReact from "@qualcomm-ui/eslint-config-react"
import quiEslintTs from "@qualcomm-ui/eslint-config-typescript"
import quiPathAlias from "@qualcomm-ui/eslint-plugin-path-alias"

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
      // CI issue with strict exports
      "./packages/common/mdx-docs-common/src/index.ts",
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
    extends: [...quiEslintTs.configs.recommended],
    files: ["scripts/*.ts"],
  },
  {
    extends: [
      quiEslintTs.configs.base,
      quiEslintTs.configs.sortKeys,
      quiEslintTs.configs.styleGuide,
    ],
    files: ["{packages,scripts}/**/*.{jsx,js,mjs,cjs}", "*.{jsx,js,mjs.cjs}"],
  },

  // angular
  {
    extends: [
      ...quiEslintTs.configs.recommended,
      quiEslintAngular.configs.baseTypescript,
      quiEslintAngular.configs.typescript,
    ],
    files: [
      "packages/*/{angular,angular-*}/**/*.ts",
      "packages/docs/angular-docs/angular-demo-module/**/*.ts",
      "packages/docs/angular-docs/**/demos/**/*.ts",
    ],
    rules: {
      "@angular-eslint/prefer-standalone": "off",
    },
  },
  {
    extends: [
      ...quiEslintTs.configs.recommended,
      quiEslintTs.configs.performance,
      quiEslintAngular.configs.baseTypescript,
      quiEslintAngular.configs.typescript,
    ],
    files: ["packages/*/{angular,angular-*}/**/*.ts"],
    ignores: [
      "packages/*/{angular,angular-*}/**/*.{component,directive,service,pipe,controller,spec}.ts",
    ],
    languageOptions,
    rules: {
      "@angular-eslint/prefer-standalone": "off",
    },
  },
  {
    extends: [
      quiEslintAngular.configs.baseTemplate,
      quiEslintAngular.configs.templatePrettier,
      quiEslintAngular.configs.templateAttributeOrder,
      quiEslintAngular.configs.templateSelfClosingTags,
    ],
    files: [
      "packages/*/{angular,angular-*}/**/*.html",
      "packages/docs/angular-docs/**/demos/**/*.html",
    ],
  },
  {
    extends: [quiEslintAngular.configs.templateSelfClosingTags],
    files: [
      "packages/*/{angular,angular-core,angular-table}/**/*.html",
      "packages/docs/angular*/src/**/demos/**/*.html",
    ],
  },

  // TODO: remove when every package is on the performance config.
  {
    extends: [...quiEslintTs.configs.recommended],
    files: ["{packages,scripts}/**/*.{ts,tsx}", "*.{ts,tsx}"],
    languageOptions,
  },

  {
    extends: [
      ...quiEslintTs.configs.recommended,
      quiEslintReact.configs.base,
      quiEslintReact.configs.recommended,
    ],
    files: [
      "packages/*/{qui-site,react-docs,react-mdx-docs,react-vscode-docs}/**/*.{ts,tsx}",
    ],
    languageOptions,
  },

  // gradually adopt strict config
  {
    extends: [
      ...quiEslintTs.configs.recommended,
      quiEslintTs.configs.performance,
    ],
    files: [
      "packages/*/{charts-base,core,docs-base,eslint-config-qui-boundaries,mdx-vite,typedoc}/**/*.ts",
    ],
    languageOptions,
  },

  // strict performance config, enforces strict type exports
  {
    extends: [
      ...quiEslintTs.configs.recommended,
      quiEslintTs.configs.performance,
      quiEslintTs.configs.strictExports,
    ],
    files: [
      "packages/*/{dom,qds-core,mdx-docs-common,utils,react-test-utils}/**/*.ts",
    ],
    languageOptions,
  },

  // gradually adopt strict config (react)
  {
    extends: [
      ...quiEslintTs.configs.recommended,
      quiEslintTs.configs.performance,
      quiEslintReact.configs.base,
      quiEslintReact.configs.recommended,
    ],
    files: [
      "packages/*/{mdx-docs,react,react-core,react-docs,react-internal,react-table-docs,react-router-utils,react-vscode}/**/*.{ts,tsx}",
      "packages/docs/angular-docs/src/**/*.tsx",
    ],
    languageOptions,
  },

  // react compiler
  {
    extends: [quiEslintReact.configs.strict],
    files: ["packages/*/{react,react-core,mdx-docs}/**/*.{ts,tsx}"],
    ignores: [
      "packages/frameworks/react-core/src/components/**/*.{ts,tsx}",
      "packages/frameworks/react-core/src/dom/use-clickable.ts",
      "packages/frameworks/react/src/legacy/**/*",
    ],
    languageOptions,
  },

  // path alias config
  {
    extends: [quiPathAlias.configs.recommended],
    files: [
      "packages/*/{angular-core,angular,core,dom,mdx-docs,qds-core,react-core,utils}/**/*.{ts,tsx}",
    ],
    languageOptions,
  },

  // react (nextgen only)
  {
    extends: [quiPathAlias.configs.recommended],
    files: ["packages/frameworks/react/src/**/*.{ts,tsx}"],
    ignores: [
      "packages/frameworks/react/src/legacy/**/*",
      "packages/frameworks/react/src/components/*/internal/q-*.{ts,tsx}",
      "packages/frameworks/react/src/components/*/q-*.{ts,tsx}",
    ],
    languageOptions,
  },

  {
    extends: [quiEslintMdx.configs.recommended],
    files: ["{packages,scripts}/**/*.{md,mdx}", "*.md"],
  },
)
