import {type ComponentPropsWithoutRef, useState} from "react"

import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"

import {Tooltip} from "@qualcomm-ui/react/tooltip"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const triggerText = "Hover me"
const tooltipContent = "Tooltip content"

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("not visible by default", async () => {
        await render(getComponent())
        await expect.element(page.getByText(triggerText)).toBeVisible()
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("visible when trigger hovered over", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("visible when trigger focused", async () => {
        await render(getComponent())
        await userEvent.tab()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("closes when trigger not hovered over", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await page.getByText(triggerText).unhover()
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("closes when trigger loses focus", async () => {
        await render(getComponent())
        await userEvent.tab()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await userEvent.tab()
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("closes on click by default", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await page.getByText(triggerText).click()
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("closes on Esc by default", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await userEvent.keyboard("{Escape}")
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root open>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip
          open
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("visible when using `open` prop", async () => {
        await render(getComponent())
        await expect.element(page.getByRole("tooltip")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root disabled>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip
          disabled
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("doesn't open when `disabled` is true", async () => {
        await render(getComponent())
        await userEvent.tab()
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root closeOnClick={false}>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip
          closeOnClick={false}
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("doesn't close on click when `closeOnClick` is false", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await page.getByText(triggerText).click()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root closeOnEscape={false}>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip
          closeOnEscape={false}
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("doesn't close on Escape when `closeOnEscape` is false", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await userEvent.keyboard("{Escape}")
        await expect.element(page.getByRole("tooltip")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root positioning={{placement: "right"}}>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip
          positioning={{placement: "right"}}
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("custom placement", async () => {
        await render(getComponent())
        const trigger = page.getByText(triggerText)
        await trigger.hover()
        const tooltip = page.getByRole("tooltip")
        await expect.element(tooltip).toBeVisible()
        await expect.element(tooltip).toHaveAttribute("data-placement", "right")

        await expect
          .poll(() => {
            const triggerBox = trigger.element().getBoundingClientRect()
            const tooltipBox = tooltip.element().getBoundingClientRect()
            return triggerBox.right < tooltipBox.right
          })
          .toBe(true)
      })
    },
  },
  {
    composite() {
      function Component() {
        const [open, setOpen] = useState(false)
        return (
          <div>
            <Tooltip.Root
              onOpenChange={(details) => setOpen(details)}
              open={open}
            >
              <Tooltip.Trigger>
                {(props) => <button {...props}>{triggerText}</button>}
              </Tooltip.Trigger>
              <Tooltip.Positioner>
                <Tooltip.Content>
                  <Tooltip.Arrow>
                    <Tooltip.ArrowTip />
                  </Tooltip.Arrow>
                  {tooltipContent}
                </Tooltip.Content>
              </Tooltip.Positioner>
            </Tooltip.Root>
            <button onClick={() => setOpen(!open)} type="button">
              Toggle Tooltip
            </button>
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
            <Tooltip
              onOpenChange={(details) => setOpen(details)}
              open={open}
              trigger={(props) => <button {...props}>{triggerText}</button>}
            >
              {tooltipContent}
            </Tooltip>
            <button onClick={() => setOpen(!open)} type="button">
              Toggle Tooltip
            </button>
          </div>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled tooltip state", async () => {
        await render(getComponent())
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
        await page.getByText("Toggle Tooltip").click()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await page.getByText("Toggle Tooltip").click()
        await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner data-test-id="positioner">
            <Tooltip.Content data-test-id="content">
              <Tooltip.Arrow data-test-id="arrow">
                <Tooltip.ArrowTip data-test-id="arrow-tip" />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip
          arrowProps={
            {"data-test-id": "arrow"} as ComponentPropsWithoutRef<"div">
          }
          arrowTipProps={
            {"data-test-id": "arrow-tip"} as ComponentPropsWithoutRef<"div">
          }
          contentProps={
            {"data-test-id": "content"} as ComponentPropsWithoutRef<"div">
          }
          positionerProps={
            {"data-test-id": "positioner"} as ComponentPropsWithoutRef<"div">
          }
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("all tooltip parts are rendered", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByTestId("positioner")).toBeVisible()
        await expect.element(page.getByTestId("content")).toBeVisible()
        await expect.element(page.getByTestId("arrow")).toBeVisible()
        await expect.element(page.getByTestId("arrow-tip")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>{tooltipContent}</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip
          hideArrow
          trigger={(props) => <button {...props}>{triggerText}</button>}
        >
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("tooltip without arrow", async () => {
        await render(getComponent())
        await page.getByText(triggerText).hover()
        await expect.element(page.getByRole("tooltip")).toBeVisible()
        await expect.element(page.getByText(tooltipContent)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Tooltip.Root>
          <Tooltip.Trigger>
            {(props) => <button {...props}>{triggerText}</button>}
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>
              <Tooltip.Arrow>
                <Tooltip.ArrowTip />
              </Tooltip.Arrow>
              {tooltipContent}
            </Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      )
    },
    simple() {
      return (
        <Tooltip trigger={(props) => <button {...props}>{triggerText}</button>}>
          {tooltipContent}
        </Tooltip>
      )
    },
    testCase: (getComponent) => {
      test("trigger has aria-describedby when open", async () => {
        await render(getComponent())
        const trigger = page.getByText(triggerText)
        await expect.element(trigger).not.toHaveAttribute("aria-describedby")
        await trigger.hover()
        await expect.element(trigger).toHaveAttribute("aria-describedby")
      })
    },
  },
]

describe("Tooltip", () => {
  runTests(tests)
})
