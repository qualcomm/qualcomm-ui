import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {preferMenuTriggerButtons} from "../src/rules/prefer-menu-trigger-buttons"

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

describe("prefer-menu-trigger-buttons", () => {
  ruleTester.run("prefer Menu trigger buttons", preferMenuTriggerButtons, {
    invalid: [
      {
        code: `
          import {Menu} from "@qualcomm-ui/react/menu"
          import {Button, IconButton} from "@qualcomm-ui/react/button"
          import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
          const App = () => (
            <Menu.Trigger>
              <Button>Open</Button>
              <IconButton aria-label="Open" icon={More} />
              <InlineIconButton aria-label="Open" icon={More} />
            </Menu.Trigger>
          )
        `,
        errors: [
          {messageId: "preferMenuButton"},
          {messageId: "preferMenuIconButton"},
          {messageId: "preferMenuInlineIconButton"},
        ],
      },
      {
        code: `
          import * as MenuModule from "@qualcomm-ui/react/menu"
          import * as ButtonModule from "@qualcomm-ui/react/button"
          const App = () => (
            <MenuModule.Menu.Trigger>
              <ButtonModule.Button>Open</ButtonModule.Button>
            </MenuModule.Menu.Trigger>
          )
        `,
        errors: [{messageId: "preferMenuButton"}],
      },
    ],
    valid: [
      {
        code: `
          import {Menu} from "@qualcomm-ui/react/menu"
          const App = () => (
            <Menu.Trigger>
              <Menu.Button>Open</Menu.Button>
              <Menu.IconButton aria-label="Open" />
              <Menu.InlineIconButton aria-label="Open" />
            </Menu.Trigger>
          )
        `,
      },
      {
        code: `
          import {Menu} from "@qualcomm-ui/react/menu"
          import {Button} from "@qualcomm-ui/react/button"
          const MyMenuTrigger = () => <Button>Open</Button>
          const App = () => (
            <Menu.Trigger>
              <MyMenuTrigger />
            </Menu.Trigger>
          )
        `,
      },
    ],
  })
})
