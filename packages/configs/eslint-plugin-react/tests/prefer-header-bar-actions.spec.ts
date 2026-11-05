import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {preferHeaderBarActions} from "../src/rules/prefer-header-bar-actions"

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

describe("prefer-header-bar-actions", () => {
  ruleTester.run("prefer HeaderBar action components", preferHeaderBarActions, {
    invalid: [
      {
        code: `
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"
          import {Button, IconButton} from "@qualcomm-ui/react/button"
          const App = () => (
            <HeaderBar.ActionBar>
              <Button>Apps</Button>
              <IconButton aria-label="Settings" icon={Settings} />
            </HeaderBar.ActionBar>
          )
        `,
        errors: [
          {messageId: "preferHeaderBarActionButton"},
          {messageId: "preferHeaderBarActionIconButton"},
        ],
      },
      {
        code: `
          import * as HeaderBarModule from "@qualcomm-ui/react/header-bar"
          import * as ButtonModule from "@qualcomm-ui/react/button"
          const App = () => (
            <HeaderBarModule.HeaderBar.ActionBar>
              <ButtonModule.Button>Apps</ButtonModule.Button>
            </HeaderBarModule.HeaderBar.ActionBar>
          )
        `,
        errors: [{messageId: "preferHeaderBarActionButton"}],
      },
    ],
    valid: [
      {
        code: `
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"
          const App = () => (
            <HeaderBar.ActionBar>
              <HeaderBar.ActionButton>Apps</HeaderBar.ActionButton>
              <HeaderBar.ActionIconButton aria-label="Settings" icon={Settings} />
            </HeaderBar.ActionBar>
          )
        `,
      },
      {
        code: `
          import {HeaderBar} from "@qualcomm-ui/react/header-bar"
          import {Button} from "@qualcomm-ui/react/button"
          const MyHeaderAction = () => <Button>Apps</Button>
          const App = () => (
            <HeaderBar.ActionBar>
              <MyHeaderAction />
            </HeaderBar.ActionBar>
          )
        `,
      },
    ],
  })
})
