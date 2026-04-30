import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {noButtonInHeaderBar} from "../src/rules/no-button-in-header-bar"

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

describe("no-button-in-header-bar", () => {
  describe("invalid", () => {
    ruleTester.run("direct Button inside HeaderBar", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <Button>Save</Button>
              </HeaderBar>
            )
          `,
          errors: [{messageId: "noButtonInHeaderBar"}],
          output: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
              </HeaderBar>
            )
          `,
        },
      ],
      valid: [],
    })

    ruleTester.run("Button inside HeaderBar.Root", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar.Root>
                <Button>Save</Button>
              </HeaderBar.Root>
            )
          `,
          errors: [{messageId: "noButtonInHeaderBar"}],
          output: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar.Root>
                <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
              </HeaderBar.Root>
            )
          `,
        },
      ],
      valid: [],
    })

    ruleTester.run("deeply nested Button", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <div>
                  <span>
                    <Button>Save</Button>
                  </span>
                </div>
              </HeaderBar>
            )
          `,
          errors: [{messageId: "noButtonInHeaderBar"}],
          output: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <div>
                  <span>
                    <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
                  </span>
                </div>
              </HeaderBar>
            )
          `,
        },
      ],
      valid: [],
    })

    ruleTester.run("aliased Button", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button as Btn} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <Btn>Save</Btn>
              </HeaderBar>
            )
          `,
          errors: [{messageId: "noButtonInHeaderBar"}],
          output: `
            import {Button as Btn} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
              </HeaderBar>
            )
          `,
        },
      ],
      valid: [],
    })

    ruleTester.run("self-closing Button", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <Button aria-label="Save" />
              </HeaderBar>
            )
          `,
          errors: [{messageId: "noButtonInHeaderBar"}],
          output: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <HeaderBar.ActionButton aria-label="Save" />
              </HeaderBar>
            )
          `,
        },
      ],
      valid: [],
    })

    ruleTester.run("namespace import HeaderBar", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import * as QUI from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <QUI.HeaderBar>
                <Button>Save</Button>
              </QUI.HeaderBar>
            )
          `,
          errors: [{messageId: "noButtonInHeaderBar"}],
          output: `
            import {Button} from "@qualcomm-ui/react/button"
            import * as QUI from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <QUI.HeaderBar>
                <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
              </QUI.HeaderBar>
            )
          `,
        },
      ],
      valid: [],
    })

    ruleTester.run("multiple violations", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <Button>Save</Button>
                <Button>Cancel</Button>
              </HeaderBar>
            )
          `,
          errors: [
            {messageId: "noButtonInHeaderBar"},
            {messageId: "noButtonInHeaderBar"},
          ],
          output: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
                <HeaderBar.ActionButton>Cancel</HeaderBar.ActionButton>
              </HeaderBar>
            )
          `,
        },
      ],
      valid: [],
    })

    ruleTester.run("react-internal package", noButtonInHeaderBar, {
      invalid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react-internal/button"
            import {HeaderBar} from "@qualcomm-ui/react-internal/header-bar"
            const App = () => (
              <HeaderBar>
                <Button>Save</Button>
              </HeaderBar>
            )
          `,
          errors: [{messageId: "noButtonInHeaderBar"}],
          output: `
            import {Button} from "@qualcomm-ui/react-internal/button"
            import {HeaderBar} from "@qualcomm-ui/react-internal/header-bar"
            const App = () => (
              <HeaderBar>
                <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
              </HeaderBar>
            )
          `,
        },
      ],
      valid: [],
    })
  })

  describe("valid", () => {
    ruleTester.run("Button outside HeaderBar", noButtonInHeaderBar, {
      invalid: [],
      valid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <div>
                <HeaderBar>
                  <span>Title</span>
                </HeaderBar>
                <Button>Save</Button>
              </div>
            )
          `,
        },
      ],
    })

    ruleTester.run(
      "HeaderBar.ActionButton inside HeaderBar",
      noButtonInHeaderBar,
      {
        invalid: [],
        valid: [
          {
            code: `
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <HeaderBar.ActionButton>Save</HeaderBar.ActionButton>
              </HeaderBar>
            )
          `,
          },
        ],
      },
    )

    ruleTester.run("non-QUI Button", noButtonInHeaderBar, {
      invalid: [],
      valid: [
        {
          code: `
            import {Button} from "some-other-lib"
            import {HeaderBar} from "@qualcomm-ui/react/header-bar"
            const App = () => (
              <HeaderBar>
                <Button>Save</Button>
              </HeaderBar>
            )
          `,
        },
      ],
    })

    ruleTester.run("non-QUI HeaderBar", noButtonInHeaderBar, {
      invalid: [],
      valid: [
        {
          code: `
            import {Button} from "@qualcomm-ui/react/button"
            import {HeaderBar} from "some-other-lib"
            const App = () => (
              <HeaderBar>
                <Button>Save</Button>
              </HeaderBar>
            )
          `,
        },
      ],
    })

    ruleTester.run("no imports", noButtonInHeaderBar, {
      invalid: [],
      valid: [
        {
          code: `
            const App = () => (
              <HeaderBar>
                <Button>Save</Button>
              </HeaderBar>
            )
          `,
        },
      ],
    })
  })
})
