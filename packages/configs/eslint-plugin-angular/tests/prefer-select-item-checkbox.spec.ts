import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {preferSelectItemCheckbox} from "../src/rules/prefer-select-item-checkbox.js"

RuleTester.afterAll = afterAll
RuleTester.it = it
RuleTester.itOnly = it.only
RuleTester.describe = describe

const angularEslint = await import("angular-eslint")

const ruleTester = new RuleTester({
  languageOptions: {
    parser: angularEslint.templateParser,
  },
})

ruleTester.run("prefer-select-item-checkbox", preferSelectItemCheckbox, {
  invalid: [
    {
      code: `
        <div q-select-root selectionIndicator="checkbox">
          <span q-select-item-indicator></span>
        </div>
      `,
      errors: [{messageId: "preferSelectItemCheckbox"}],
    },
    {
      code: `
        <div q-select-root [selectionIndicator]="'checkbox'">
          <span q-select-item-indicator></span>
        </div>
      `,
      errors: [{messageId: "preferSelectItemCheckbox"}],
    },
  ],
  valid: [
    {
      code: `
        <div q-select-root selectionIndicator="checkbox">
          <span q-select-item-checkbox></span>
        </div>
      `,
    },
    {
      code: `
        <div q-select-root selectionIndicator="checkmark">
          <span q-select-item-indicator></span>
        </div>
      `,
    },
    {
      code: `<span q-select-item-indicator></span>`,
    },
  ],
})
