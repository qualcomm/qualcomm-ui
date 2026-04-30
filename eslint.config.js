import {defineConfig} from "eslint/config"
import {join} from "node:path"
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
    extends: [...quiEslintTs.configs.recommended],
    files: ["scripts/*.ts"],
  },
  {
    extends: [
      quiEslintTs.configs.base,
      quiEslintTs.configs.sortKeys,
      quiEslintTs.configs.styleGuide,
    ],
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
      ...quiEslintTs.configs.recommended,
      quiEslintAngular.configs.baseTypescript,
      quiEslintAngular.configs.typescript,
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
      ...quiEslintTs.configs.recommended,
      quiEslintTs.configs.performance,
      quiEslintAngular.configs.baseTypescript,
      quiEslintAngular.configs.typescript,
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
      quiEslintAngular.configs.baseTemplate,
      quiEslintAngular.configs.templatePrettier,
      quiEslintAngular.configs.templateAttributeOrder,
      quiEslintAngular.configs.templateSelfClosingTags,
      quiEslintPluginAngular.config,
    ],
    files: [
      "packages/*/{angular,angular-*}/**/*.html",
      "packages/docs/angular-docs/**/demos/**/*.html",
      "packages/debug-apps/angular*/src/**/*.html",
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
      quiEslintPluginReact.config,
    ],
    files: [
      "packages/*/{qui-site,react-docs,qui-docs,react-table-docs,react-vscode-docs}/**/*.{ts,tsx}",
    ],
    languageOptions,
  },

  {
    extends: [quiEslintPluginReact.config],
    files: ["packages/*/react-mdx/**/*.{ts,tsx}"],
    languageOptions,
  },

  // gradually adopt strict config
  {
    extends: [
      ...quiEslintTs.configs.recommended,
      quiEslintTs.configs.performance,
    ],
    files: [
      "packages/*/{charts-base,core,eslint-config-qui-boundaries,mdx-vite,typedoc}/**/*.ts",
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
      "packages/*/{dom,qds-core,mdx-common,node-utils,utils,react-test-utils}/**/*.ts",
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
      "packages/*/{react-mdx,react,react-core,react-docs,react-internal,react-swagger,react-table-docs,react-router-utils,react-vscode}/**/*.{ts,tsx}",
      "packages/docs/angular-docs/src/**/*.tsx",
    ],
    languageOptions,
  },

  {
    files: ["packages/*/react-swagger/**/*.{ts,tsx}"],
    languageOptions,
    rules: {
      "@typescript-eslint/no-unsafe-function-type": "off",
      "react/prop-types": "off",
    },
  },

  // react compiler
  {
    extends: [quiEslintReact.configs.strict],
    files: ["packages/*/{react,react-core,react-mdx}/**/*.{ts,tsx}"],
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
      "packages/*/{angular-core,angular,audit-mcp,core,dom,react-mdx,qds-core,react,react-core,utils}/**/*.{ts,tsx}",
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
