import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

// @ts-expect-error
import {noCircularPathAlias} from "../rules/no-circular-path-alias.js"

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaVersion: "latest",
      projectService: true,
      sourceType: "module",
    },
  },
})

ruleTester.run("no-circular-path-alias", noCircularPathAlias, {
  invalid: [
    // Self-referential imports (should be caught immediately)
    {
      code: `import foo from "@mock/foo"`,
      errors: [{messageId: "circularDependency"}],
      filename: "./tests/packages/mock/src/foo.ts",
    },
    // Path alias self-import
    {
      code: `import self from "@mock/dir-1"`,
      errors: [{messageId: "circularDependency"}],
      filename: "./tests/packages/mock/src/dir-1/index.ts",
    },
    // Export self-reference
    {
      code: `export {default} from "@mock/utils"`,
      errors: [{messageId: "circularDependency"}],
      filename: "./tests/packages/mock/src/utils/index.ts",
    },
    // Dynamic import self-reference
    {
      code: `const mod = await import("@qualcomm-ui/nested/one")`,
      errors: [{messageId: "circularDependency"}],
      filename: "./tests/packages/nested/src/one/index.ts",
    },
  ],
  valid: [
    // Normal imports that don't create immediate cycles
    {
      code: `import {bar} from "@mock/bar"`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    {
      code: `import dir2 from "@mock/dir-2"`,
      filename: "./tests/packages/mock/src/dir-1/file-1.ts",
    },
    {
      code: `import {file} from "@qualcomm-ui/nested/one"`,
      filename: "./tests/packages/nested/src/two/file.ts",
    },
    // Sibling imports within same directory (allowed)
    {
      code: `import sibling from "./file-2"`,
      filename: "./tests/packages/mock/src/dom/parser/file.ts",
    },
    // Parent imports (allowed)
    {
      code: `import parent from "../index"`,
      filename: "./tests/packages/mock/src/dom/parser/file.ts",
    },
    // Dynamic imports to different modules
    {
      code: `const mod = await import("@mock/bar")`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    // External module imports
    {
      code: `import fs from "node:fs"
import {useState} from "react"`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    // Type-only imports
    {
      code: `import type {SomeType} from "../types.ts"`,
      filename: "./tests/packages/nested/src/two/internal/module.ts",
    },
    // Imports outside path alias scope
    {
      code: `import type {SomeType} from "../types.ts"`,
      filename: "./tests/packages/not-path-alias/src/module/internal/module.ts",
    },
    // Helper imports
    {
      code: `import helper from "./helper"`,
      filename: "./tests/packages/not-path-alias/src/module/index.ts",
    },
    // External path imports (outside project)
    {
      code: `import utils from "../../../vendor/utils"`,
      filename: "./tests/packages/mock/src/dom/parser/file.ts",
    },
    // Re-exports to different modules
    {
      code: `export {default as bar} from "@mock/bar"`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    // Internal module exports
    {
      code: `export * from "./internal/module"`,
      filename: "./tests/packages/nested/src/two/index.ts",
    },
  ],
})
