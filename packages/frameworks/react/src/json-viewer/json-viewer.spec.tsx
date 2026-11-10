import {type CSSProperties, useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {JsonViewer, useJsonViewer} from "@qualcomm-ui/react/json-viewer"

const data = {settings: {theme: "dark"}}
const variants = ["simple", "composite"] as const

describe("JSON viewer", () => {
  describe.each(variants)("%s render strategy", (variant) => {
    test.each([
      {lazyMount: undefined, name: "defaults", unmountOnExit: undefined},
      {lazyMount: true, name: "lazy mounting", unmountOnExit: false},
      {lazyMount: false, name: "unmount on exit", unmountOnExit: true},
      {lazyMount: true, name: "both enabled", unmountOnExit: true},
    ])(
      "$name controls descendant mounting",
      async ({lazyMount, unmountOnExit}) => {
        const props = {data, defaultExpandedDepth: 1, lazyMount, unmountOnExit}
        await render(
          variant === "simple" ? (
            <JsonViewer {...props} />
          ) : (
            <JsonViewer.Root {...props}>
              <JsonViewer.Tree />
            </JsonViewer.Root>
          ),
        )

        const settings = page.getByRole("button", {name: /^settings:/})
        const theme = page.getByText('"dark"', {exact: true})

        if (lazyMount) {
          await expect.element(theme).not.toBeInTheDocument()
        } else {
          await expect.element(theme).toBeInTheDocument()
          await expect.element(theme).not.toBeVisible()
        }

        await settings.click()
        await expect.element(theme).toBeVisible()
        await settings.click()

        if (unmountOnExit) {
          await expect.element(theme).not.toBeInTheDocument()
        } else {
          await expect.element(theme).toBeInTheDocument()
          await expect.element(theme).not.toBeVisible()
        }

        await settings.click()
        await expect.element(theme).toBeVisible()
      },
    )
  })

  test.each(variants)(
    "%s keeps descendants mounted until the collapse animation completes",
    async (variant) => {
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
      const props = {
        data,
        defaultExpandedDepth: 2,
        lazyMount: true,
        unmountOnExit: true,
      }
      await render(
        <div
          onAnimationStart={pauseExitAnimation}
          style={{"--animation-duration-moderate": "60s"} as CSSProperties}
        >
          {variant === "simple" ? (
            <JsonViewer {...props} />
          ) : (
            <JsonViewer.Root {...props}>
              <JsonViewer.Tree />
            </JsonViewer.Root>
          )}
        </div>,
      )

      const theme = page.getByText('"dark"', {exact: true})
      await expect.element(theme).toBeVisible()
      await page.getByRole("button", {name: /^settings:/}).click()
      await expect.poll(() => exitAnimations.length).toBeGreaterThan(0)
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
      await expect.element(theme).toBeInTheDocument()
      for (const animation of exitAnimations) {
        animation.play()
        animation.finish()
      }
      await expect.element(theme).not.toBeInTheDocument()
    },
  )

  test.each(variants)(
    "%s moves keyboard focus into newly expanded branches and back to their parent",
    async (variant) => {
      await render(
        variant === "simple" ? (
          <JsonViewer
            data={data}
            defaultExpandedDepth={1}
            lazyMount
            unmountOnExit
          />
        ) : (
          <JsonViewer.Root
            data={data}
            defaultExpandedDepth={1}
            lazyMount
            unmountOnExit
          >
            <JsonViewer.Tree />
          </JsonViewer.Root>
        ),
      )

      const settings = page.getByRole("button", {name: /^settings:/})
      const theme = page.getByRole("treeitem", {name: 'theme: "dark"'})

      await userEvent.tab()
      await userEvent.keyboard("{ArrowDown}")
      await expect.element(settings).toHaveFocus()

      await userEvent.keyboard("{ArrowRight}")
      await expect.element(theme).toBeVisible()
      await userEvent.keyboard("{ArrowRight}")
      await expect.element(theme).toHaveFocus()

      await userEvent.keyboard("{ArrowLeft}")
      await expect.element(settings).toHaveFocus()
      await userEvent.keyboard("{ArrowLeft}")
      await expect.element(theme).not.toBeInTheDocument()
      await expect.element(settings).toHaveFocus()
    },
  )

  test("controlled expansion includes unmounted branches and retains nested expansion", async () => {
    function TestViewer() {
      const [expandedValue, setExpandedValue] = useState<string[]>([])
      const viewer = useJsonViewer({
        data: {settings: {appearance: {theme: "dark"}}},
        expandedValue,
        lazyMount: true,
        onExpandedValueChange: ({expandedValue}) =>
          setExpandedValue(expandedValue),
        unmountOnExit: true,
      })

      return (
        <>
          <button
            onClick={() =>
              setExpandedValue(viewer.collection.getBranchValues())
            }
          >
            Expand all
          </button>
          <button onClick={() => setExpandedValue([])}>Collapse all</button>
          <JsonViewer.RootProvider value={viewer}>
            <JsonViewer.Tree />
          </JsonViewer.RootProvider>
        </>
      )
    }

    await render(<TestViewer />)

    const settings = page.getByRole("button", {name: /^settings:/})
    const theme = page.getByRole("treeitem", {name: 'theme: "dark"'})

    await expect.element(settings).not.toBeInTheDocument()
    await page.getByRole("button", {name: "Expand all"}).click()
    await expect.element(theme).toBeVisible()

    await settings.click()
    await expect.element(theme).not.toBeInTheDocument()
    await settings.click()
    await expect.element(theme).toBeVisible()

    await page.getByRole("button", {name: "Collapse all"}).click()
    await expect.element(settings).not.toBeInTheDocument()
    await page.getByRole("button", {name: "Expand all"}).click()
    await expect.element(theme).toBeVisible()
  })
})
