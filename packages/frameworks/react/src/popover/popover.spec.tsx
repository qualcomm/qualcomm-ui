import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Popover} from "@qualcomm-ui/react/popover"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const triggerText = "Click me"
const popoverLabel = "Popover Label"
const popoverDescription = "Popover Description"
const focusableLinkText = "Focusable Link"
const outsideButtonText = "Outside Button"
const closeButtonLabel = "Close Popover"

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
        await render(getComponent())
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
        await render(getComponent())
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
        await render(getComponent())
        await expect.element(page.getByText(popoverLabel)).toBeVisible()
        await expect
          .element(page.getByLabelText(popoverLabel))
          .toHaveAccessibleDescription(popoverDescription)
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
      test("trigger click toggles open/closed", async () => {
        await render(getComponent())

        const trigger = page.getByText(triggerText)
        await expect
          .element(page.getByLabelText(popoverLabel))
          .not.toBeVisible()

        await trigger.click()
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()

        await trigger.click()
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
              <Popover.Label>{popoverLabel}</Popover.Label>
              <a href="#">{focusableLinkText}</a>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      )
    },
    simple() {
      return (
        <Popover
          label={popoverLabel}
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          <a href="#">{focusableLinkText}</a>
        </Popover>
      )
    },
    testCase: (getComponent) => {
      test("escape key closes popover", async () => {
        await render(getComponent())

        await page.getByText(triggerText).click()
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()

        await userEvent.keyboard("{Escape}")
        await expect
          .element(page.getByLabelText(popoverLabel))
          .not.toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <div>
          <button type="button">{outsideButtonText}</button>
          <Popover.Root>
            <Popover.Anchor>
              <Popover.Trigger>
                {(props) => <button {...props}>{triggerText}</button>}
              </Popover.Trigger>
            </Popover.Anchor>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Label>{popoverLabel}</Popover.Label>
                <a href="#">{focusableLinkText}</a>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
      )
    },
    simple() {
      return (
        <div>
          <button type="button">{outsideButtonText}</button>
          <Popover
            label={popoverLabel}
            trigger={(props) => <button {...props}>{triggerText}</button>}
          >
            <a href="#">{focusableLinkText}</a>
          </Popover>
        </div>
      )
    },
    testCase: (getComponent) => {
      test("closes when clicking outside", async () => {
        await render(getComponent())

        await page.getByText(triggerText).click()
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()

        await page.getByText(outsideButtonText).click()
        await expect
          .element(page.getByLabelText(popoverLabel))
          .not.toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <div>
          <button type="button">{outsideButtonText}</button>
          <Popover.Root closeOnInteractOutside={false}>
            <Popover.Anchor>
              <Popover.Trigger>
                {(props) => <button {...props}>{triggerText}</button>}
              </Popover.Trigger>
            </Popover.Anchor>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Label>{popoverLabel}</Popover.Label>
                <a href="#">{focusableLinkText}</a>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
      )
    },
    simple() {
      return (
        <div>
          <button type="button">{outsideButtonText}</button>
          <Popover
            closeOnInteractOutside={false}
            label={popoverLabel}
            trigger={(props) => <button {...props}>{triggerText}</button>}
          >
            <a href="#">{focusableLinkText}</a>
          </Popover>
        </div>
      )
    },
    testCase: (getComponent) => {
      test("closeOnInteractOutside=false keeps popover open", async () => {
        await render(getComponent())

        await page.getByText(triggerText).click()
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()

        await page.getByText(outsideButtonText).click()
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [open, setOpen] = useState(false)
        return (
          <div>
            <div data-test-id="state-value">{open ? "open" : "closed"}</div>
            <Popover.Root onOpenChange={setOpen} open={open}>
              <Popover.Anchor>
                <Popover.Trigger>
                  {(props) => <button {...props}>{triggerText}</button>}
                </Popover.Trigger>
              </Popover.Anchor>
              <Popover.Positioner>
                <Popover.Content>
                  <Popover.Label>{popoverLabel}</Popover.Label>
                  <a href="#">{focusableLinkText}</a>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>
          </div>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [open, setOpen] = useState(false)
        return (
          <div>
            <div data-test-id="state-value">{open ? "open" : "closed"}</div>
            <Popover
              label={popoverLabel}
              onOpenChange={setOpen}
              open={open}
              trigger={(props) => <button {...props}>{triggerText}</button>}
            >
              <a href="#">{focusableLinkText}</a>
            </Popover>
          </div>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled open state with onOpenChange", async () => {
        await render(getComponent())

        const stateValue = page.getByTestId("state-value")
        await expect.element(stateValue).toHaveTextContent("closed")
        await expect
          .element(page.getByLabelText(popoverLabel))
          .not.toBeVisible()

        await page.getByText(triggerText).click()
        await expect.element(stateValue).toHaveTextContent("open")
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()

        await userEvent.keyboard("{Escape}")
        await expect.element(stateValue).toHaveTextContent("closed")
        await expect
          .element(page.getByLabelText(popoverLabel))
          .not.toBeVisible()
      })
    },
  },
  {
    composite: undefined,
    testCase: () => {
      test("onOpenChange callback fires with open/close values", async () => {
        const spy = vi.fn()
        await render(
          <Popover.Root onOpenChange={spy}>
            <Popover.Anchor>
              <Popover.Trigger>
                {(props) => <button {...props}>{triggerText}</button>}
              </Popover.Trigger>
            </Popover.Anchor>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Label>{popoverLabel}</Popover.Label>
                <a href="#">{focusableLinkText}</a>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>,
        )

        const trigger = page.getByText(triggerText)

        await trigger.click()
        await expect.poll(() => spy).toHaveBeenCalledWith(true)

        await userEvent.keyboard("{Escape}")
        await expect.poll(() => spy).toHaveBeenLastCalledWith(false)
      })
    },
  },
  {
    composite() {
      return (
        <Popover.Root defaultOpen>
          <Popover.Anchor>
            <Popover.Trigger>
              {(props) => <button {...props}>{triggerText}</button>}
            </Popover.Trigger>
          </Popover.Anchor>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Label>{popoverLabel}</Popover.Label>
              <a href="#">{focusableLinkText}</a>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      )
    },
    simple() {
      return (
        <Popover
          defaultOpen
          label={popoverLabel}
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          <a href="#">{focusableLinkText}</a>
        </Popover>
      )
    },
    testCase: (getComponent) => {
      test("defaultOpen renders with popover visible", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()

        await page.getByText(triggerText).click()
        await expect
          .element(page.getByLabelText(popoverLabel))
          .not.toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <div>
          <button type="button">{outsideButtonText}</button>
          <Popover.Root modal>
            <Popover.Anchor>
              <Popover.Trigger>
                {(props) => <button {...props}>{triggerText}</button>}
              </Popover.Trigger>
            </Popover.Anchor>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Label>{popoverLabel}</Popover.Label>
                <a href="#">{focusableLinkText}</a>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
      )
    },
    simple() {
      return (
        <div>
          <button type="button">{outsideButtonText}</button>
          <Popover
            label={popoverLabel}
            modal
            trigger={(props) => <button {...props}>{triggerText}</button>}
          >
            <a href="#">{focusableLinkText}</a>
          </Popover>
        </div>
      )
    },
    testCase: (getComponent) => {
      test("modal traps focus inside popover", async () => {
        await render(getComponent())

        await page.getByText(triggerText).click()
        await expect.element(page.getByText(focusableLinkText)).toHaveFocus()

        // Tab cycles focus within the popover - should not land on outside button.
        await userEvent.tab()
        await expect
          .element(page.getByText(outsideButtonText))
          .not.toHaveFocus()
      })
    },
  },
  {
    composite() {
      return (
        <div>
          <button type="button">{outsideButtonText}</button>
          <Popover.Root modal={false}>
            <Popover.Anchor>
              <Popover.Trigger>
                {(props) => <button {...props}>{triggerText}</button>}
              </Popover.Trigger>
            </Popover.Anchor>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Label>{popoverLabel}</Popover.Label>
                <a href="#">{focusableLinkText}</a>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </div>
      )
    },
    testCase: (getComponent) => {
      test("modal=false does not trap focus", async () => {
        await render(getComponent())

        await page.getByText(triggerText).click()
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()
        // Without modal trap, focus can leave the popover and still resolve.
        await expect
          .element(page.getByText(outsideButtonText))
          .toBeInTheDocument()
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
              <Popover.Label>{popoverLabel}</Popover.Label>
              <Popover.CloseTrigger>
                {(props) => (
                  <button {...props} aria-label={closeButtonLabel}>
                    X
                  </button>
                )}
              </Popover.CloseTrigger>
            </Popover.Content>
          </Popover.Positioner>
        </Popover.Root>
      )
    },
    testCase: (getComponent) => {
      test("CloseTrigger click closes popover", async () => {
        await render(getComponent())

        await page.getByText(triggerText).click()
        await expect.element(page.getByLabelText(popoverLabel)).toBeVisible()

        await page.getByLabelText(closeButtonLabel).click()
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
              <Popover.Label>{popoverLabel}</Popover.Label>
              <Popover.Description>{popoverDescription}</Popover.Description>
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
      test("exposes dialog role with accessible name when open", async () => {
        await render(getComponent())

        await expect.element(page.getByRole("dialog")).not.toBeInTheDocument()

        await page.getByText(triggerText).click()

        const dialog = page.getByRole("dialog")
        await expect.element(dialog).toBeVisible()
        await expect.element(dialog).toHaveAccessibleName(popoverLabel)
      })
    },
  },
]

describe("Popover", () => {
  runTests(tests)
})
