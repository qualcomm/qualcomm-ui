import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {avatarImageAlt} from "../src/rules/avatar-image-alt.js"

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

ruleTester.run("avatar-image-alt", avatarImageAlt, {
  invalid: [
    {
      code: `<img q-avatar-image src="/user.jpg" />`,
      errors: [{messageId: "missingAlt"}],
    },
    {
      code: `<img q-avatar-image alt="" src="/user.jpg" />`,
      errors: [{messageId: "missingAlt"}],
    },
  ],
  valid: [
    {
      code: `<img q-avatar-image alt="John Doe" src="/user.jpg" />`,
    },
    {
      code: `<img q-avatar-image [alt]="userName" src="/user.jpg" />`,
    },
    {
      code: `<img src="/user.jpg" />`,
    },
  ],
})
