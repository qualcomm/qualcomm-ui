import {page} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"

import {Popover} from "@qualcomm-ui/react/popover"
import {type MultiComponentTestCase, runTests} from "@qualcomm-ui/react-test-utils"

const triggerText = "Click me"
const popoverLabel = "Popover Label"
const popoverDescription = "Popover Description"
const focusableLinkText = "Focusable Link"

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Popover.Root>
          <Popover.Anchor>
            <Popover.Trigger>
              {(props) => <button {...props}>{triggerText}</button>}
            </Popover.Trigger>
          </Popover.Anchor>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow>
                <Popover.ArrowTip />
              </Popover.Arrow>
              <Popover.Label>{popoverLabel}</Popover.Label>
              <Popover.Description>{popoverDescription}</Popover.Description>
              <a href="#">{focusableLinkText}</a>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      )
    },
    simple() {
      return (
        <Popover
          description={popoverDescription}
          label={popoverLabel}
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          <a href="#">{focusableLinkText}</a>
        </Popover>
      )
    },
    testCase: (getComponent) => {
      test("default state (closed)", async () => {
        render(getComponent())
        await expect.element(page.getByText(triggerText)).toBeVisible()
        await expect
          .element(page.getByLabelText(popoverLabel))
          .not.toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Popover.Root>
          <Popover.Anchor>
            <Popover.Trigger>
              {(props) => <button {...props}>{triggerText}</button>}
            </Popover.Trigger>
          </Popover.Anchor>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow>
                <Popover.ArrowTip />
              </Popover.Arrow>
              <Popover.Label>{popoverLabel}</Popover.Label>
              <Popover.Description>{popoverDescription}</Popover.Description>
              <a href="#">{focusableLinkText}</a>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      )
    },
    simple() {
      return (
        <Popover
          description={popoverDescription}
          label={popoverLabel}
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          <a href="#">{focusableLinkText}</a>
        </Popover>
      )
    },
    testCase: (getComponent) => {
      test("focus item on open", async () => {
        render(getComponent())
        await page.getByText(triggerText).click()
        await expect.element(page.getByText(focusableLinkText)).toHaveFocus()
      })
    },
  },
  {
    composite() {
      return (
        <Popover.Root open>
          <Popover.Anchor>
            <Popover.Trigger>
              {(props) => <button {...props}>{triggerText}</button>}
            </Popover.Trigger>
          </Popover.Anchor>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Arrow>
                <Popover.ArrowTip />
              </Popover.Arrow>
              <Popover.Label>{popoverLabel}</Popover.Label>
              <Popover.Description>{popoverDescription}</Popover.Description>
              <a href="#">{focusableLinkText}</a>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      )
    },
    simple() {
      return (
        <Popover
          description={popoverDescription}
          label={popoverLabel}
          open
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          <a href="#">{focusableLinkText}</a>
        </Popover>
      )
    },
    testCase: (getComponent) => {
      test("content accessibility", async () => {
        render(getComponent())
        await expect.element(page.getByText(popoverLabel)).toBeVisible()
        await expect
          .element(page.getByLabelText(popoverLabel))
          .toHaveAccessibleDescription(popoverDescription)
      })
    },
  },
]

describe("Popover", () => {
  runTests(tests)
})
