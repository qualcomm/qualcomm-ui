import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {interactiveCardElementNesting} from "../src/rules/interactive-card-element-nesting"

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

describe("interactive-card-element-nesting", () => {
  describe("invalid: native interactive elements", () => {
    ruleTester.run("button", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <button>Click</button>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("anchor", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <a href="/page">Link</a>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("input", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <input type="text" />
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("select", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <select><option>A</option></select>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("textarea", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <textarea />
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("details", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <details><summary>Info</summary></details>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: deeply nested interactive elements", () => {
    ruleTester.run("nested in div", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <div>
                  <span>
                    <button>Click</button>
                  </span>
                </div>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("in fragment", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <>
                  <button>Click</button>
                </>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: QUI interactive components", () => {
    ruleTester.run("Button", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            import {Button} from "@qualcomm-ui/react/button"
            const App = () => (
              <Card.Root interactive>
                <Button>Click</Button>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("Link", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            import {Link} from "@qualcomm-ui/react/link"
            const App = () => (
              <Card.Root interactive>
                <Link href="/page">Go</Link>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("IconButton", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            import {IconButton} from "@qualcomm-ui/react/icon-button"
            const App = () => (
              <Card.Root interactive>
                <IconButton aria-label="action" />
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: Card compound interactive components", () => {
    ruleTester.run("Card.Button", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <Card.Button>Click</Card.Button>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run("Card.Link", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <Card.Link href="/page">Go</Card.Link>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: multiple violations", () => {
    ruleTester.run("two violations", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            import {Button} from "@qualcomm-ui/react/button"
            const App = () => (
              <Card.Root interactive>
                <Button>Click</Button>
                <a href="/page">Link</a>
              </Card.Root>
            )
          `,
          errors: [
            {messageId: "noInteractiveChildren"},
            {messageId: "noInteractiveChildren"},
          ],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: aliased imports", () => {
    ruleTester.run("aliased Card", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card as C} from "@qualcomm-ui/react/card"
            const App = () => (
              <C.Root interactive>
                <button>Click</button>
              </C.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run(
      "aliased interactive component",
      interactiveCardElementNesting,
      {
        invalid: [
          {
            code: `
              import {Card} from "@qualcomm-ui/react/card"
              import {Button as Btn} from "@qualcomm-ui/react/button"
              const App = () => (
                <Card.Root interactive>
                  <Btn>Click</Btn>
                </Card.Root>
              )
            `,
            errors: [{messageId: "noInteractiveChildren"}],
          },
        ],
        valid: [],
      },
    )
  })

  describe("invalid: namespace imports", () => {
    ruleTester.run("namespace Card", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import * as QUI from "@qualcomm-ui/react/card"
            const App = () => (
              <QUI.Card.Root interactive>
                <button>Click</button>
              </QUI.Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })

    ruleTester.run(
      "namespace interactive component",
      interactiveCardElementNesting,
      {
        invalid: [
          {
            code: `
              import * as QUI from "@qualcomm-ui/react/card"
              import * as Btn from "@qualcomm-ui/react/button"
              const App = () => (
                <QUI.Card.Root interactive>
                  <Btn.Button>Click</Btn.Button>
                </QUI.Card.Root>
              )
            `,
            errors: [{messageId: "noInteractiveChildren"}],
          },
        ],
        valid: [],
      },
    )
  })

  describe("invalid: render props", () => {
    ruleTester.run(
      "render prop with JSX element",
      interactiveCardElementNesting,
      {
        invalid: [
          {
            code: `
              import {Card} from "@qualcomm-ui/react/card"
              import {Avatar} from "@qualcomm-ui/react/avatar"
              const App = () => (
                <Card.Root interactive>
                  <Avatar.Root render={<button />} />
                </Card.Root>
              )
            `,
            errors: [{messageId: "noInteractiveChildren"}],
          },
        ],
        valid: [],
      },
    )

    ruleTester.run(
      "render prop with arrow function returning JSX",
      interactiveCardElementNesting,
      {
        invalid: [
          {
            code: `
              import {Card} from "@qualcomm-ui/react/card"
              import {Avatar} from "@qualcomm-ui/react/avatar"
              const App = () => (
                <Card.Root interactive>
                  <Avatar.Root render={(props) => <a href="/page" {...props} />} />
                </Card.Root>
              )
            `,
            errors: [{messageId: "noInteractiveChildren"}],
          },
        ],
        valid: [],
      },
    )

    ruleTester.run(
      "render prop with non-interactive element",
      interactiveCardElementNesting,
      {
        invalid: [],
        valid: [
          {
            code: `
              import {Card} from "@qualcomm-ui/react/card"
              import {Avatar} from "@qualcomm-ui/react/avatar"
              const App = () => (
                <Card.Root interactive>
                  <Avatar.Root render={<div />} />
                </Card.Root>
              )
            `,
          },
        ],
      },
    )
  })

  describe("invalid: interactive prop variations", () => {
    ruleTester.run("interactive={true}", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive={true}>
                <button>Click</button>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("invalid: react-internal package", () => {
    ruleTester.run("internal import", interactiveCardElementNesting, {
      invalid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react-internal/card"
            const App = () => (
              <Card.Root interactive>
                <button>Click</button>
              </Card.Root>
            )
          `,
          errors: [{messageId: "noInteractiveChildren"}],
        },
      ],
      valid: [],
    })
  })

  describe("valid: non-interactive content", () => {
    ruleTester.run("non-interactive children", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive>
                <div>
                  <span>Text content</span>
                  <p>Paragraph</p>
                  <img src="/photo.jpg" alt="Photo" />
                </div>
              </Card.Root>
            )
          `,
        },
      ],
    })
  })

  describe("valid: Card.Root without interactive prop", () => {
    ruleTester.run("no interactive prop", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root>
                <button>Click</button>
              </Card.Root>
            )
          `,
        },
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <Card.Root interactive={false}>
                <button>Click</button>
              </Card.Root>
            )
          `,
        },
      ],
    })
  })

  describe("valid: interactive elements outside Card.Root", () => {
    ruleTester.run("button as sibling", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            import {Card} from "@qualcomm-ui/react/card"
            const App = () => (
              <div>
                <Card.Root interactive>
                  <span>Card content</span>
                </Card.Root>
                <button>Click</button>
              </div>
            )
          `,
        },
      ],
    })
  })

  describe("non-QUI components", () => {
    ruleTester.run("ignored", interactiveCardElementNesting, {
      invalid: [],
      valid: [
        {
          code: `
            <Card.Root interactive>
              <button>Click</button>
            </Card.Root>
          `,
        },
        {
          code: `
            import {Card} from "other-library"
            const App = () => (
              <Card.Root interactive>
                <button>Click</button>
              </Card.Root>
            )
          `,
        },
        {
          code: `
            const Card = {Root: () => <div />}
            const App = () => (
              <Card.Root interactive>
                <button>Click</button>
              </Card.Root>
            )
          `,
        },
      ],
    })
  })
})
