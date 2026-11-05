import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {preferCardActions} from "../src/rules/prefer-card-actions.js"

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

ruleTester.run("prefer-card-actions", preferCardActions, {
  invalid: [
    {
      code: `
        <div q-card>
          <button q-button>Confirm</button>
        </div>
      `,
      errors: [{messageId: "preferCardButton"}],
    },
    {
      code: `
        <div q-card>
          <a q-link href="/details">Details</a>
        </div>
      `,
      errors: [{messageId: "preferCardLink"}],
    },
  ],
  valid: [
    {
      code: `
        <div q-card>
          <button q-card-button>Confirm</button>
          <a q-card-link href="/details">Details</a>
        </div>
      `,
    },
    {
      code: `<button q-button>Standalone</button>`,
    },
  ],
})
