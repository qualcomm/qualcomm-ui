import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

// @ts-expect-error
import {importFromTsconfigPaths} from "../rules/import-from-tsconfig-paths.js"

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

ruleTester.run("import-from-tsconfig-paths", importFromTsconfigPaths, {
  invalid: [
    {
      code: `import input from "../../input"`,
      errors: [{messageId: "externalRelative"}],
      filename: "./tests/packages/angular/radio/radio-group/index.ts",
      output: `import input from "@qualcomm-ui/angular/input"`,
    },
    {
      code: `import input from "../../input"`,
      errors: [{messageId: "externalRelative"}],
      filename: "./tests/packages/angular/radio/radio-group/some-file.ts",
      output: `import input from "@qualcomm-ui/angular/input"`,
    },
    {
      code: `import dir2 from "../dir-2"`,
      errors: [{messageId: "externalRelative"}],
      filename: "./tests/packages/mock/src/dir-1/file-1.ts",
      output: `import dir2 from "@mock/dir-2"`,
    },
    {
      code: `import helper from "../../vendor/utils"`,
      errors: [{messageId: "externalRelative"}],
      filename: "./tests/packages/mock/src/dom/parser/file.ts",
    },
    {
      code: `import method from "../../input"`,
      errors: [{messageId: "externalRelative"}],
      filename: "./tests/packages/angular/radio/radio-group/index.ts",
      output: `import method from "@qualcomm-ui/angular/input"`,
    },
    {
      code: `import method from "../../one"`,
      errors: [{messageId: "externalRelative"}],
      filename: "./tests/packages/nested/src/two/not-internal/file.ts",
      output: `import method from "@qualcomm-ui/nested/one"`,
    },
  ],
  valid: [
    {
      code: `import bar from "./bar"`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    {
      code: `import {file} from "@qualcomm-ui/nested/one"`,
      filename: "./tests/packages/nested/src/two/file.ts",
    },
    {
      code: `import {bar} from "@mock/bar"`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    {
      code: `import dir2 from "@mock/dir-2"`,
      filename: "./tests/packages/mock/src/dir-1/file-1.ts",
    },
    {
      code: `import sibling from "./file-2"`,
      filename: "./tests/packages/mock/src/dom/parser/file.ts",
    },
    {
      code: `import parent from "../index"`,
      filename: "./tests/packages/mock/src/dom/parser/file.ts",
    },
    {
      code: `const mod = await import("@mock/bar")`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    {
      code: `import fs from "node:fs"
import {useState} from "react"`,
      filename: "./tests/packages/mock/src/foo.ts",
    },
    {
      code: `import type {SomeType} from "../types.ts"`,
      filename: "./tests/packages/nested/src/two/internal/module.ts",
    },
    {
      code: `import type {SomeType} from "../types.ts"`,
      filename: "./tests/packages/not-path-alias/src/module/internal/module.ts",
    },
    {
      code: `import helper from "./radio-group/nested"`,
      filename: "./tests/packages/angular/radio/root-radio.ts",
    },
    {
      code: `import helper from "../radio-group/some-file"`,
      filename: "./tests/packages/angular/radio/internal-to-radio/file.ts",
    },
    {
      code: `import helper from ".."`,
      filename: "./tests/packages/angular/radio/internal-to-radio/file.ts",
    },
  ],
})
