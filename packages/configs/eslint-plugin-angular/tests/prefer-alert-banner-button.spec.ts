import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {preferAlertBannerButton} from "../src/rules/prefer-alert-banner-button.js"

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

ruleTester.run("prefer-alert-banner-button", preferAlertBannerButton, {
  invalid: [
    {
      code: `
        <div q-alert-banner>
          <button q-button>Retry</button>
        </div>
      `,
      errors: [{messageId: "preferAlertBannerButton"}],
    },
    {
      code: `
        <div q-alert-banner-root>
          <button q-alert-banner-action>Retry</button>
        </div>
      `,
      errors: [{messageId: "preferAlertBannerButton"}],
    },
    {
      code: `<button q-alert-banner-action>Retry</button>`,
      errors: [{messageId: "preferAlertBannerButton"}],
    },
  ],
  valid: [
    {
      code: `
        <div q-alert-banner>
          <button q-alert-banner-button>Retry</button>
        </div>
      `,
    },
    {
      code: `<button q-button>Standalone</button>`,
    },
  ],
})
