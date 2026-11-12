import {type CSSProperties, useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {JsonViewer, useJsonViewer} from "@qualcomm-ui/react/json-viewer"
import {
  type JsonNodeHastElement,
  nodeToValue,
} from "@qualcomm-ui/utils/json-tree"

const data = {settings: {theme: "dark"}}
const variants = ["simple", "composite"] as const

describe("JSON viewer", () => {
  test.each(variants)(
    "%s renders custom nested values after collapsing and reopening a branch",
    async (variant) => {
      function renderValue(node: JsonNodeHastElement) {
        return node.type === "text" && node.value === '"dark"'
          ? "Custom theme"
          : undefined
      }

      const props = {
        data,
        defaultExpandedDepth: 2,
        lazyMount: true,
        unmountOnExit: true,
      }

      await render(
        variant === "simple" ? (
          <JsonViewer {...props} treeProps={{renderValue}} />
        ) : (
          <JsonViewer.Root {...props}>
            <JsonViewer.Tree renderValue={renderValue} />
          </JsonViewer.Root>
        ),
      )

      const theme = page.getByRole("treeitem", {name: 'theme: "dark"'})
      const settings = page.getByRole("button", {name: /^settings:/})
      await expect.element(theme.getByText("Custom theme")).toBeVisible()
      await settings.click()
      await expect.element(theme).not.toBeInTheDocument()
      await settings.click()
      await expect.element(theme.getByText("Custom theme")).toBeVisible()
    },
  )

  test.each([...variants, "provider"])(
    "%s prioritizes explicit default expanded values over the default depth",
    async (variant) => {
      const rootValue = nodeToValue({
        keyPath: ["$"],
        type: "object",
        value: data,
      })
      const props = {
        data,
        defaultExpandedDepth: 2,
        defaultExpandedValue: [rootValue],
      }

      function TestViewer() {
        const viewer = useJsonViewer(props)
        return (
          <JsonViewer.RootProvider value={viewer}>
            <JsonViewer.Tree />
          </JsonViewer.RootProvider>
        )
      }

      await render(
        variant === "simple" ? (
          <JsonViewer {...props} />
        ) : variant === "composite" ? (
          <JsonViewer.Root {...props}>
            <JsonViewer.Tree />
          </JsonViewer.Root>
        ) : (
          <TestViewer />
        ),
      )

      const settings = page.getByRole("button", {name: /^settings:/})
      const theme = page.getByText('"dark"', {exact: true})
      await expect.element(settings).toBeVisible()
      await expect.element(theme).not.toBeVisible()
      await settings.click()
      await expect.element(theme).toBeVisible()
    },
  )

  test.each(variants)(
    "%s uses the default depth when default expanded values are undefined",
    async (variant) => {
      const props = {
        data,
        defaultExpandedDepth: 2,
        defaultExpandedValue: undefined,
      }
      await render(
        variant === "simple" ? (
          <JsonViewer {...props} />
        ) : (
          <JsonViewer.Root {...props}>
            <JsonViewer.Tree />
          </JsonViewer.Root>
        ),
      )

      await expect
        .element(page.getByRole("treeitem", {name: 'theme: "dark"'}))
        .toBeVisible()
    },
  )

  test.each(variants)(
    "%s updates key quotes when preview options change",
    async (variant) => {
      function TestViewer() {
        const [quotesOnKeys, setQuotesOnKeys] = useState(false)
        const props = {data, defaultExpandedDepth: 2, quotesOnKeys}
        return (
          <>
            <button onClick={() => setQuotesOnKeys(true)}>Quote keys</button>
            {variant === "simple" ? (
              <JsonViewer {...props} />
            ) : (
              <JsonViewer.Root {...props}>
                <JsonViewer.Tree />
              </JsonViewer.Root>
            )}
          </>
        )
      }

      await render(<TestViewer />)
      await expect.element(page.getByText("theme", {exact: true})).toBeVisible()
      await page.getByRole("button", {name: "Quote keys"}).click()
      await expect
        .element(page.getByText('"theme"', {exact: true}))
        .toBeVisible()
    },
  )

  test.each([...variants, "provider", "provider hook"])(
    "%s preserves preview visibility when a custom class is supplied",
    async (variant) => {
      const className = "custom-json-viewer"
      const props = {
        className,
        data,
        defaultExpandedDepth: 2,
      }

      function TestViewer() {
        const viewer = useJsonViewer(
          variant === "provider hook" ? props : {data, defaultExpandedDepth: 2},
        )
        return (
          <JsonViewer.RootProvider
            className={variant === "provider" ? className : undefined}
            value={viewer}
          >
            <JsonViewer.Tree />
          </JsonViewer.RootProvider>
        )
      }

      await render(
        variant === "simple" ? (
          <JsonViewer {...props} />
        ) : variant === "composite" ? (
          <JsonViewer.Root {...props}>
            <JsonViewer.Tree />
          </JsonViewer.Root>
        ) : (
          <TestViewer />
        ),
      )

      const settings = page.getByRole("button", {name: /^settings:/})
      const preview = settings.getByText('theme: "dark"', {exact: true})
      const openingBrace = settings.getByText("{", {exact: true})
      const closingBrace = settings.getByText("}", {exact: true})
      const branchEnd = page
        .getByRole("treeitem", {name: /^settings:/})
        .getByRole("group")
        .getByText("}", {exact: true})
      await expect.element(preview).not.toBeVisible()
      await expect.element(openingBrace).toBeVisible()
      await expect.element(closingBrace).not.toBeVisible()
      await expect.element(branchEnd).toBeVisible()
      await settings.click()
      await expect.element(preview).toBeVisible()
      await expect.element(openingBrace).toBeVisible()
      await expect.element(closingBrace).toBeVisible()
      await settings.click()
      await expect.element(preview).not.toBeVisible()
      await expect.element(openingBrace).toBeVisible()
      await expect.element(closingBrace).not.toBeVisible()
      await expect.element(branchEnd).toBeVisible()
    },
  )

  test.each(variants)(
    "%s renders array brackets around expanded children",
    async (variant) => {
      const props = {
        data: {items: ["one", "two"]},
        defaultExpandedDepth: 2,
        lazyMount: true,
        unmountOnExit: true,
      }

      await render(
        variant === "simple" ? (
          <JsonViewer {...props} />
        ) : (
          <JsonViewer.Root {...props}>
            <JsonViewer.Tree />
          </JsonViewer.Root>
        ),
      )

      const items = page.getByRole("button", {name: /^items:/})
      const preview = items.getByText('"one", "two"', {exact: true})
      const openingBracket = items.getByText("[", {exact: true})
      const closingBracket = items.getByText("]", {exact: true})
      const branchEnd = page
        .getByRole("treeitem", {name: /^items:/})
        .getByRole("group")
        .getByText("]", {exact: true})

      await expect.element(preview).not.toBeVisible()
      await expect.element(openingBracket).toBeVisible()
      await expect.element(closingBracket).not.toBeVisible()
      await expect.element(branchEnd).toBeVisible()
      await expect.element(page.getByText('"one"', {exact: true})).toBeVisible()

      await items.click()
      await expect.element(preview).toBeVisible()
      await expect.element(openingBracket).toBeVisible()
      await expect.element(closingBracket).toBeVisible()
      await expect
        .element(page.getByText('"one"', {exact: true}))
        .not.toBeInTheDocument()

      await items.click()
      await expect.element(preview).not.toBeVisible()
      await expect.element(openingBracket).toBeVisible()
      await expect.element(closingBracket).not.toBeVisible()
      await expect.element(branchEnd).toBeVisible()
      await expect.element(page.getByText('"one"', {exact: true})).toBeVisible()
    },
  )

  test.each([...variants, "provider"])(
    "%s toggles expanded brackets without changing collapsed previews",
    async (variant) => {
      function TestViewer() {
        const [showExpandedBrackets, setShowExpandedBrackets] = useState(false)
        const props = {
          data: {items: ["one"], settings: {theme: "dark"}},
          defaultExpandedDepth: 2,
          showExpandedBrackets,
        }
        const viewer = useJsonViewer(props)

        return (
          <>
            <button onClick={() => setShowExpandedBrackets((value) => !value)}>
              Toggle brackets
            </button>
            {variant === "simple" ? (
              <JsonViewer {...props} />
            ) : variant === "composite" ? (
              <JsonViewer.Root {...props}>
                <JsonViewer.Tree />
              </JsonViewer.Root>
            ) : (
              <JsonViewer.RootProvider value={viewer}>
                <JsonViewer.Tree />
              </JsonViewer.RootProvider>
            )}
          </>
        )
      }

      await render(<TestViewer />)

      for (const [key, opening, closing] of [
        ["settings", "{", "}"],
        ["items", "[", "]"],
      ] as const) {
        const branch = page.getByRole("button", {name: new RegExp(`^${key}:`)})
        const openingBracket = branch.getByText(opening, {exact: true})
        const closingBracket = branch.getByText(closing, {exact: true})
        const branchEnd = page
          .getByRole("treeitem", {name: new RegExp(`^${key}:`)})
          .getByRole("group")
          .getByText(closing, {exact: true})
        const toggle = page.getByRole("button", {name: "Toggle brackets"})

        await expect.element(openingBracket).not.toBeVisible()
        await expect.element(branchEnd).not.toBeInTheDocument()
        await toggle.click()
        await expect.element(openingBracket).toBeVisible()
        await expect.element(closingBracket).not.toBeVisible()
        await expect.element(branchEnd).toBeVisible()
        await toggle.click()
        await expect.element(openingBracket).not.toBeVisible()
        await expect.element(branchEnd).not.toBeInTheDocument()

        await branch.click()
        await expect.element(openingBracket).toBeVisible()
        await expect.element(closingBracket).toBeVisible()
      }
    },
  )

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
