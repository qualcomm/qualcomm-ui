import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {preferCardActions} from "../src/rules/prefer-card-actions"

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

describe("prefer-card-actions", () => {
  ruleTester.run("prefer Card action components", preferCardActions, {
    invalid: [
      {
        code: `
          import {Card} from "@qualcomm-ui/react/card"
          import {Button} from "@qualcomm-ui/react/button"
          const App = () => (
            <Card.Root>
              <Card.Footer>
                <Button>Confirm</Button>
              </Card.Footer>
            </Card.Root>
          )
        `,
        errors: [{messageId: "preferCardButton"}],
      },
      {
        code: `
          import {Card as Tile} from "@qualcomm-ui/react/card"
          import {Link as QuiLink} from "@qualcomm-ui/react/link"
          const App = () => (
            <Tile.Root>
              <QuiLink href="/details">Details</QuiLink>
            </Tile.Root>
          )
        `,
        errors: [{messageId: "preferCardLink"}],
      },
      {
        code: `
          import * as CardModule from "@qualcomm-ui/react/card"
          import * as ButtonModule from "@qualcomm-ui/react/button"
          const App = () => (
            <CardModule.Card.Root>
              <ButtonModule.Button>Confirm</ButtonModule.Button>
            </CardModule.Card.Root>
          )
        `,
        errors: [{messageId: "preferCardButton"}],
      },
    ],
    valid: [
      {
        code: `
          import {Card} from "@qualcomm-ui/react/card"
          const App = () => (
            <Card.Root>
              <Card.Button>Confirm</Card.Button>
              <Card.Link href="/details">Details</Card.Link>
            </Card.Root>
          )
        `,
      },
      {
        code: `
          import {Card} from "@qualcomm-ui/react/card"
          import {Button} from "@qualcomm-ui/react/button"
          const MyCardAction = () => <Button>Confirm</Button>
          const App = () => (
            <Card.Root>
              <MyCardAction />
            </Card.Root>
          )
        `,
      },
      {
        code: `
          import {Card} from "@qualcomm-ui/react/card"
          import {Link} from "other-library"
          const App = () => (
            <Card.Root>
              <Link href="/details">Details</Link>
            </Card.Root>
          )
        `,
      },
    ],
  })
})
