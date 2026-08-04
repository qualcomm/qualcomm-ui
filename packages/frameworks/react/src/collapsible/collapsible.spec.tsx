import {useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Collapsible} from "@qualcomm-ui/react/collapsible"

import {type MultiComponentTest, runTests} from "~test-utils/runner"

const triggerLabel = "Toggle"
const contentText = "Collapsible content"

const testIds = {
  content: "collapsible-content",
  root: "collapsible-root",
  trigger: "collapsible-trigger",
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      return (
        <Collapsible.Root>
          <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
          <Collapsible.Content>{contentText}</Collapsible.Content>
        </Collapsible.Root>
      )
    },
    testCase: (getComponent) => {
      test("open/close on trigger click", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: triggerLabel})
        const content = page.getByText(contentText)

        await expect.element(content).not.toBeVisible()

        await trigger.click()
        await expect.element(content).toBeVisible()

        await trigger.click()
        await expect.element(content).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Collapsible.Root defaultOpen>
          <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
          <Collapsible.Content>{contentText}</Collapsible.Content>
        </Collapsible.Root>
      )
    },
    testCase: (getComponent) => {
      test("defaultOpen - initially open", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: triggerLabel})
        const content = page.getByText(contentText)

        await expect.element(content).toBeVisible()

        await trigger.click()
        await expect.element(content).not.toBeVisible()

        await trigger.click()
        await expect.element(content).toBeVisible()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [open, setOpen] = useState(false)
        return (
          <Collapsible.Root onOpenChange={setOpen} open={open}>
            <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
            <Collapsible.Content>{contentText}</Collapsible.Content>
          </Collapsible.Root>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled open state", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: triggerLabel})
        const content = page.getByText(contentText)

        await expect.element(content).not.toBeVisible()

        await trigger.click()
        await expect.element(content).toBeVisible()

        await trigger.click()
        await expect.element(content).not.toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Collapsible.Root disabled>
          <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
          <Collapsible.Content>{contentText}</Collapsible.Content>
        </Collapsible.Root>
      )
    },
    testCase: () => {
      test("disabled - trigger clicks are no-ops", async () => {
        const spy = vi.fn()
        await render(
          <Collapsible.Root disabled onOpenChange={spy}>
            <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
            <Collapsible.Content>{contentText}</Collapsible.Content>
          </Collapsible.Root>,
        )

        const trigger = page.getByRole("button", {name: triggerLabel})
        const content = page.getByText(contentText)

        await expect.element(content).not.toBeVisible()
        await trigger.click()
        await expect.element(content).not.toBeVisible()
        expect(spy).not.toHaveBeenCalled()
      })
    },
  },
  {
    composite() {
      return (
        <Collapsible.Root>
          <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
          <Collapsible.Content>{contentText}</Collapsible.Content>
        </Collapsible.Root>
      )
    },
    testCase: () => {
      test("onOpenChange callback fires", async () => {
        const spy = vi.fn()
        await render(
          <Collapsible.Root onOpenChange={spy}>
            <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
            <Collapsible.Content>{contentText}</Collapsible.Content>
          </Collapsible.Root>,
        )

        const trigger = page.getByRole("button", {name: triggerLabel})

        await trigger.click()
        expect(spy).toHaveBeenLastCalledWith(true)

        await trigger.click()
        expect(spy).toHaveBeenLastCalledWith(false)
      })
    },
  },
  {
    composite() {
      return (
        <Collapsible.Root data-test-id={testIds.root}>
          <Collapsible.Trigger data-test-id={testIds.trigger}>
            {triggerLabel}
          </Collapsible.Trigger>
          <Collapsible.Content data-test-id={testIds.content}>
            {contentText}
          </Collapsible.Content>
        </Collapsible.Root>
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        await render(getComponent())

        await expect.element(page.getByTestId(testIds.root)).toBeInTheDocument()
        await expect
          .element(page.getByTestId(testIds.trigger))
          .toBeInTheDocument()
        await expect
          .element(page.getByTestId(testIds.content))
          .toBeInTheDocument()
      })
    },
  },
]

describe("Collapsible", () => {
  runTests(tests)
})
