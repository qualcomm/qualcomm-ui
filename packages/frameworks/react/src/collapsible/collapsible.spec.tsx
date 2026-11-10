import {type CSSProperties, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {CoreCollapsible} from "@qualcomm-ui/react-core/collapsible"
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
  describe.each(["root", "provider"] as const)(
    "%s render strategy",
    (variant) => {
      test.each([
        {lazyMount: undefined, name: "defaults", unmountOnExit: undefined},
        {lazyMount: true, name: "lazy mounting", unmountOnExit: false},
        {lazyMount: false, name: "unmount on exit", unmountOnExit: true},
        {lazyMount: true, name: "both enabled", unmountOnExit: true},
      ])(
        "$name controls content mounting",
        async ({lazyMount, unmountOnExit}) => {
          const Root =
            variant === "root" ? Collapsible.Root : CoreCollapsible.RootProvider
          await render(
            <Root lazyMount={lazyMount} unmountOnExit={unmountOnExit}>
              <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
              <Collapsible.Content aria-label="Details" role="region">
                {contentText}
              </Collapsible.Content>
            </Root>,
          )

          const content = page.getByLabelText("Details")
          const trigger = page.getByRole("button", {name: triggerLabel})
          if (lazyMount) {
            await expect.element(content).not.toBeInTheDocument()
          } else {
            await expect.element(content).toBeInTheDocument()
            await expect.element(content).not.toBeVisible()
          }

          await trigger.click()
          await expect.element(content).toBeVisible()
          await trigger.click()
          if (unmountOnExit) {
            await expect.element(content).not.toBeInTheDocument()
          } else {
            await expect.element(content).toBeInTheDocument()
            await expect.element(content).not.toBeVisible()
          }

          await trigger.click()
          await expect.element(content).toBeVisible()
        },
      )
    },
  )

  test.each([false, true])(
    "unmountOnExit=%s determines whether local input state survives collapse",
    async (unmountOnExit) => {
      await render(
        <Collapsible.Root lazyMount unmountOnExit={unmountOnExit}>
          <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
          <Collapsible.Content>
            <input aria-label="Notes" defaultValue="initial" />
          </Collapsible.Content>
        </Collapsible.Root>,
      )

      const trigger = page.getByRole("button", {name: triggerLabel})
      const input = page.getByLabelText("Notes")
      await trigger.click()
      await input.fill("edited")
      await trigger.click()
      if (unmountOnExit) {
        await expect.element(input).not.toBeInTheDocument()
      } else {
        await expect.element(input).not.toBeVisible()
      }
      await trigger.click()
      await expect
        .element(input)
        .toHaveValue(unmountOnExit ? "initial" : "edited")
    },
  )

  test("unmounts after the collapse animation and reports exit completion", async () => {
    const onExitComplete = vi.fn()
    const exitAnimations: Animation[] = []
    const pauseExitAnimation = (event: {target: EventTarget | null}) => {
      if (event.target instanceof HTMLElement) {
        for (const animation of event.target.getAnimations()) {
          if (!exitAnimations.includes(animation)) {
            animation.pause()
            exitAnimations.push(animation)
          }
        }
      }
    }
    await render(
      <Collapsible.Root
        defaultOpen
        lazyMount
        onAnimationStart={pauseExitAnimation}
        onExitComplete={onExitComplete}
        style={{"--animation-duration-moderate": "60s"} as CSSProperties}
        unmountOnExit
      >
        <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
        <Collapsible.Content>{contentText}</Collapsible.Content>
      </Collapsible.Root>,
    )

    const content = page.getByText(contentText)
    await expect.element(content).toBeVisible()
    await page.getByRole("button", {name: triggerLabel}).click()
    await expect.poll(() => exitAnimations.length).toBeGreaterThan(0)
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })
    await expect.element(content).toBeInTheDocument()
    expect(onExitComplete).not.toHaveBeenCalled()
    for (const animation of exitAnimations) {
      animation.play()
      animation.finish()
    }
    await expect.element(content).not.toBeInTheDocument()
    await expect.poll(() => onExitComplete).toHaveBeenCalledOnce()
  })

  test("controlled content mounts and unmounts on trigger and external updates", async () => {
    function ControlledViewer() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <button onClick={() => setOpen(true)}>Open externally</button>
          <button onClick={() => setOpen(false)}>Close externally</button>
          <Collapsible.Root
            lazyMount
            onOpenChange={setOpen}
            open={open}
            unmountOnExit
          >
            <Collapsible.Trigger>{triggerLabel}</Collapsible.Trigger>
            <Collapsible.Content>{contentText}</Collapsible.Content>
          </Collapsible.Root>
        </>
      )
    }

    await render(<ControlledViewer />)
    const content = page.getByText(contentText)
    await expect.element(content).not.toBeInTheDocument()
    await page.getByRole("button", {name: "Open externally"}).click()
    await expect.element(content).toBeVisible()
    await page.getByRole("button", {name: triggerLabel}).click()
    await expect.element(content).not.toBeInTheDocument()
    await page.getByRole("button", {name: triggerLabel}).click()
    await expect.element(content).toBeVisible()
    await page.getByRole("button", {name: "Close externally"}).click()
    await expect.element(content).not.toBeInTheDocument()
  })

  runTests(tests)
})
