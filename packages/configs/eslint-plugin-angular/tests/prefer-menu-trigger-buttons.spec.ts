import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {preferMenuTriggerButtons} from "../src/rules/prefer-menu-trigger-buttons.js"

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

ruleTester.run("prefer-menu-trigger-buttons", preferMenuTriggerButtons, {
  invalid: [
    {
      code: `
        <div q-menu-trigger>
          <button q-button>Open</button>
        </div>
      `,
      errors: [{messageId: "preferMenuButton"}],
    },
    {
      code: `
        <div q-menu-trigger>
          <button q-icon-button aria-label="Open"></button>
        </div>
      `,
      errors: [{messageId: "preferMenuIconButton"}],
    },
    {
      code: `
        <div q-menu-trigger>
          <button q-inline-icon-button aria-label="Open"></button>
        </div>
      `,
      errors: [{messageId: "preferMenuIconButton"}],
    },
  ],
  valid: [
    {
      code: `
        <div q-menu-trigger>
          <button q-menu-button>Open</button>
          <button q-menu-icon-button aria-label="Open"></button>
        </div>
      `,
    },
    {
      code: `<button q-icon-button aria-label="Standalone"></button>`,
    },
  ],
})
