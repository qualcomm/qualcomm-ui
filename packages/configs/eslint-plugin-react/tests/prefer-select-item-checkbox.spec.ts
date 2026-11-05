import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {preferSelectItemCheckbox} from "../src/rules/prefer-select-item-checkbox"

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      ecmaFeatures: {jsx: true},
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
})

describe("prefer-select-item-checkbox", () => {
  ruleTester.run("prefer Select.ItemCheckbox", preferSelectItemCheckbox, {
    invalid: [
      {
        code: `
          import {Select} from "@qualcomm-ui/react/select"
          const App = () => (
            <Select.Root selectionIndicator="checkbox">
              <Select.Item>
                <Select.ItemIndicator />
              </Select.Item>
            </Select.Root>
          )
        `,
        errors: [{messageId: "preferSelectItemCheckbox"}],
      },
      {
        code: `
          import * as SelectModule from "@qualcomm-ui/react/select"
          const App = () => (
            <SelectModule.Select.Root selectionIndicator={"checkbox"}>
              <SelectModule.Select.ItemIndicator />
            </SelectModule.Select.Root>
          )
        `,
        errors: [{messageId: "preferSelectItemCheckbox"}],
      },
    ],
    valid: [
      {
        code: `
          import {Select} from "@qualcomm-ui/react/select"
          const App = () => (
            <Select.Root selectionIndicator="checkbox">
              <Select.ItemCheckbox />
            </Select.Root>
          )
        `,
      },
      {
        code: `
          import {Select} from "@qualcomm-ui/react/select"
          const App = () => (
            <Select.Root>
              <Select.ItemIndicator />
            </Select.Root>
          )
        `,
      },
      {
        code: `
          import {Select} from "@qualcomm-ui/react/select"
          const selectionIndicator = "checkbox"
          const App = () => (
            <Select.Root selectionIndicator={selectionIndicator}>
              <Select.ItemIndicator />
            </Select.Root>
          )
        `,
      },
    ],
  })
})
