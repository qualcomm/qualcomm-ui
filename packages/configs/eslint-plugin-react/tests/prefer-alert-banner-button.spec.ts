import {RuleTester} from "@typescript-eslint/rule-tester"
import tseslint from "typescript-eslint"
import {afterAll, describe, it} from "vitest"

import {preferAlertBannerButton} from "../src/rules/prefer-alert-banner-button"

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

describe("prefer-alert-banner-button", () => {
  ruleTester.run("prefer AlertBanner.Button", preferAlertBannerButton, {
    invalid: [
      {
        code: `
          import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
          import {Button} from "@qualcomm-ui/react/button"
          const App = () => <AlertBanner action={<Button>Retry</Button>} />
        `,
        errors: [{messageId: "preferAlertBannerButton"}],
      },
      {
        code: `
          import {AlertBanner as Banner} from "@qualcomm-ui/react/alert-banner"
          import {Button as QuiButton} from "@qualcomm-ui/react/button"
          const App = () => (
            <Banner.Root>
              <QuiButton>Retry</QuiButton>
            </Banner.Root>
          )
        `,
        errors: [{messageId: "preferAlertBannerButton"}],
      },
      {
        code: `
          import * as AlertBannerModule from "@qualcomm-ui/react/alert-banner"
          import * as ButtonModule from "@qualcomm-ui/react/button"
          const App = () => (
            <AlertBannerModule.AlertBanner.Root>
              <ButtonModule.Button>Retry</ButtonModule.Button>
            </AlertBannerModule.AlertBanner.Root>
          )
        `,
        errors: [{messageId: "preferAlertBannerButton"}],
      },
      {
        code: `
          import {AlertBanner} from "@qualcomm-ui/react-internal/alert-banner"
          const App = () => (
            <AlertBanner.Root>
              <AlertBanner.ActionContainer>Retry</AlertBanner.ActionContainer>
            </AlertBanner.Root>
          )
        `,
        errors: [{messageId: "preferAlertBannerButton"}],
      },
    ],
    valid: [
      {
        code: `
          import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
          const App = () => <AlertBanner action={<AlertBanner.Button>Retry</AlertBanner.Button>} />
        `,
      },
      {
        code: `
          import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
          const MyBannerAction = () => <button>Retry</button>
          const App = () => <AlertBanner action={<MyBannerAction />} />
        `,
      },
      {
        code: `
          import {AlertBanner} from "@qualcomm-ui/react/alert-banner"
          import {Button} from "other-library"
          const App = () => <AlertBanner action={<Button>Retry</Button>} />
        `,
      },
    ],
  })
})
