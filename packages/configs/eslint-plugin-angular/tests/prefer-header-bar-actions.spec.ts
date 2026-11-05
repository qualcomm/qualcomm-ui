import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {preferHeaderBarActions} from "../src/rules/prefer-header-bar-actions.js"

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

ruleTester.run("prefer-header-bar-actions", preferHeaderBarActions, {
  invalid: [
    {
      code: `
        <div q-header-bar-action-bar>
          <button q-button>Apps</button>
        </div>
      `,
      errors: [{messageId: "preferHeaderBarActionButton"}],
    },
    {
      code: `
        <div q-header-bar-action-bar>
          <button q-icon-button aria-label="Settings"></button>
        </div>
      `,
      errors: [{messageId: "preferHeaderBarActionIconButton"}],
    },
  ],
  valid: [
    {
      code: `
        <div q-header-bar-action-bar>
          <button q-header-bar-action-button>Apps</button>
          <button q-header-bar-action-icon-button aria-label="Settings"></button>
        </div>
      `,
    },
    {
      code: `<button q-button>Standalone</button>`,
    },
  ],
})
