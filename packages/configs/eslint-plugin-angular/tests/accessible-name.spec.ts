import {RuleTester} from "@typescript-eslint/rule-tester"
import {afterAll, describe, it} from "vitest"

import {accessibleName} from "../src/rules/accessible-name.js"

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

ruleTester.run("accessible-name", accessibleName, {
  invalid: [
    {
      code: `<button q-icon-button></button>`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<button q-icon-button icon="close"></button>`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<button q-icon-button aria-label=""></button>`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<button q-icon-button aria-labelledby=""></button>`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<button q-icon-button (click)="handleClick()"></button>`,
      errors: [{messageId: "missingLabel"}],
    },
    {
      code: `<button q-header-bar-action-icon-button></button>`,
      errors: [{messageId: "missingLabel"}],
    },
  ],
  valid: [
    {
      code: `<button q-icon-button aria-label="Close"></button>`,
    },
    {
      code: `<button q-icon-button aria-labelledby="close-label"></button>`,
    },
    {
      code: `<button q-icon-button aria-label="Delete item" icon="delete"></button>`,
    },
    {
      code: `<button q-icon-button [attr.aria-label]="label"></button>`,
    },
    {
      code: `<button q-icon-button [attr.aria-label]="'label'"></button>`,
    },
    {
      code: `<button q-icon-button [attr.aria-labelledby]="labelId"></button>`,
    },
    {
      code: `<button q-header-bar-action-icon-button aria-label="Settings"></button>`,
    },
    {
      code: `<button q-button>Click me</button>`,
    },
    {
      code: `<div aria-label="test"></div>`,
    },
  ],
})
