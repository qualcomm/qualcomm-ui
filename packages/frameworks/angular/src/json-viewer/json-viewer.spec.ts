import {signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {nodeToValue} from "@qualcomm-ui/utils/json-tree"

const data = {settings: {theme: "dark"}}

const variants = [
  {
    name: "simple",
    template: `<div q-json-viewer [data]="data" [defaultExpandedDepth]="2"></div>`,
  },
  {
    name: "composite",
    template: `
      <div q-json-viewer-root [data]="data" [defaultExpandedDepth]="2">
        <div q-json-viewer-tree></div>
      </div>
    `,
  },
]

describe("JSON viewer", () => {
  describe.each(variants)("$name render strategy", ({template}) => {
    test.each([
      {lazyMount: undefined, name: "defaults", unmountOnExit: undefined},
      {lazyMount: true, name: "lazy mounting", unmountOnExit: false},
      {lazyMount: false, name: "unmount on exit", unmountOnExit: true},
      {lazyMount: true, name: "both enabled", unmountOnExit: true},
    ])(
      "$name controls descendant mounting",
      async ({lazyMount, name, unmountOnExit}) => {
        const mountingInputs =
          name === "defaults"
            ? ""
            : '[lazyMount]="lazyMount" [unmountOnExit]="unmountOnExit"'
        await render(
          template
            .replace('[data]="data"', `[data]="data" ${mountingInputs}`)
            .replace('defaultExpandedDepth]="2"', 'defaultExpandedDepth]="1"'),
          {
            componentProperties: {data, lazyMount, unmountOnExit},
            imports: [JsonViewerModule],
          },
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
    "$name prioritizes explicit default expanded values over the default depth",
    async ({template}) => {
      const rootValue = nodeToValue({
        keyPath: ["$"],
        type: "object",
        value: data,
      })
      await render(
        template.replace(
          '[data]="data"',
          '[data]="data" [defaultExpandedValue]="defaultExpandedValue"',
        ),
        {
          componentProperties: {data, defaultExpandedValue: [rootValue]},
          imports: [JsonViewerModule],
        },
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
    "$name restores nested expansion after a parent is collapsed and reopened",
    async ({template}) => {
      await render(
        template
          .replace('[data]="data"', '[data]="data" lazyMount unmountOnExit')
          .replace('defaultExpandedDepth]="2"', 'defaultExpandedDepth]="3"'),
        {
          componentProperties: {
            data: {settings: {appearance: {theme: "dark"}}},
          },
          imports: [JsonViewerModule],
        },
      )

      const settings = page.getByRole("button", {name: /^settings:/})
      const theme = page.getByRole("treeitem", {name: 'theme: "dark"'})

      await expect.element(theme).toBeVisible()
      await settings.click()
      await expect.element(theme).not.toBeInTheDocument()
      await settings.click()
      await expect.element(theme).toBeVisible()
    },
  )

  test.each(variants)(
    "$name keeps descendants mounted until the collapse animation completes",
    async ({template}) => {
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
        `<div style="--animation-duration-moderate: 60s" (animationstart)="pauseExitAnimation($event)">
          ${template.replace('[data]="data"', '[data]="data" lazyMount unmountOnExit')}
        </div>`,
        {
          componentProperties: {data, pauseExitAnimation},
          imports: [JsonViewerModule],
        },
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
    "$name moves keyboard focus into newly expanded branches and back to their parent",
    async ({template}) => {
      await render(
        template
          .replace('[data]="data"', '[data]="data" lazyMount unmountOnExit')
          .replace('defaultExpandedDepth]="2"', 'defaultExpandedDepth]="1"'),
        {
          componentProperties: {data},
          imports: [JsonViewerModule],
        },
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

  test.each(variants)(
    "$name hides complex previews and function signatures only when expanded",
    async ({template}) => {
      await render(template, {
        componentProperties: {
          data: {
            callback: function onUpdate() {},
            searchParams: new URLSearchParams({page: "1"}),
          },
        },
        imports: [JsonViewerModule],
      })

      const callback = page.getByRole("button", {
        name: /^callback: ƒ onUpdate\(\),/,
      })
      const searchParams = page.getByRole("button", {
        name: /^searchParams: URLSearchParams,/,
      })
      const signature = callback.getByText("onUpdate()", {exact: true})
      const preview = searchParams.getByText("size: 1", {exact: true})

      await expect.element(signature).not.toBeVisible()
      await expect.element(preview).not.toBeVisible()
      await expect.element(callback.getByText("ƒ", {exact: true})).toBeVisible()
      await expect
        .element(searchParams.getByText("URLSearchParams", {exact: true}))
        .toBeVisible()

      await callback.click()
      await expect.element(signature).toBeVisible()
      await expect.element(preview).not.toBeVisible()

      await searchParams.click()
      await expect.element(preview).toBeVisible()

      await callback.click()
      await expect.element(signature).not.toBeVisible()
      await expect.element(preview).toBeVisible()

      await searchParams.click()
      await expect.element(preview).not.toBeVisible()
    },
  )

  test.each(variants)(
    "$name hides expanded previews and restores them when collapsed",
    async ({template}) => {
      await render(template, {
        componentProperties: {
          data: {items: ["one", "two"], settings: {theme: "dark"}},
        },
        imports: [JsonViewerModule],
      })

      const objectPreview = page.getByText('theme: "dark"', {exact: true})
      const arrayPreview = page.getByText('"one", "two"', {exact: true})
      const settings = page.getByRole("button", {name: /^settings:/})
      const items = page.getByRole("button", {name: /^items:/})
      const openingBrace = settings.getByText("{", {exact: true})
      const closingBrace = settings.getByText("}", {exact: true})
      const openingBracket = items.getByText("[", {exact: true})
      const closingBracket = items.getByText("]", {exact: true})
      const objectEnd = page
        .getByRole("treeitem", {name: /^settings:/})
        .getByRole("group")
        .getByText("}", {exact: true})
      const arrayEnd = page
        .getByRole("treeitem", {name: /^items:/})
        .getByRole("group")
        .getByText("]", {exact: true})

      await expect.element(objectPreview).not.toBeVisible()
      await expect.element(arrayPreview).not.toBeVisible()
      await expect.element(openingBrace).toBeVisible()
      await expect.element(closingBrace).not.toBeVisible()
      await expect.element(objectEnd).toBeVisible()
      await expect.element(openingBracket).toBeVisible()
      await expect.element(closingBracket).not.toBeVisible()
      await expect.element(arrayEnd).toBeVisible()
      await expect
        .element(page.getByText('"dark"', {exact: true}))
        .toBeVisible()
      await expect.element(page.getByText('"one"', {exact: true})).toBeVisible()

      await settings.click()
      await expect.element(objectPreview).toBeVisible()
      await expect.element(openingBrace).toBeVisible()
      await expect.element(closingBrace).toBeVisible()
      await expect.element(arrayPreview).not.toBeVisible()

      await items.click()
      await expect.element(arrayPreview).toBeVisible()
      await expect.element(openingBracket).toBeVisible()
      await expect.element(closingBracket).toBeVisible()

      await settings.click()
      await expect.element(objectPreview).not.toBeVisible()
      await expect.element(openingBrace).toBeVisible()
      await expect.element(closingBrace).not.toBeVisible()
      await expect.element(objectEnd).toBeVisible()
      await expect.element(arrayPreview).toBeVisible()
    },
  )

  test.each(variants)(
    "$name toggles expanded brackets without changing collapsed previews",
    async ({template}) => {
      await render(
        `
          <button (click)="showBrackets.set(!showBrackets())">Toggle brackets</button>
          ${template.replace(
            '[data]="data"',
            '[data]="data" [showExpandedBrackets]="showBrackets()"',
          )}
        `,
        {
          componentProperties: {
            data: {items: ["one"], settings: {theme: "dark"}},
            showBrackets: signal(false),
          },
          imports: [JsonViewerModule],
        },
      )

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

  test.each(variants)(
    "$name renders default expansion and toggles nested values",
    async ({template}) => {
      await render(template, {
        componentProperties: {
          data,
        },
        imports: [JsonViewerModule],
      })

      const theme = page.getByText('"dark"', {exact: true})
      const settings = page.getByText("settings", {exact: true})

      await expect.element(page.getByRole("tree")).toBeVisible()
      await expect.element(theme).toBeVisible()

      await settings.click()
      await expect.element(theme).not.toBeVisible()

      await page.getByRole("button", {exact: true, name: "Expand"}).click()
      await expect.element(theme).toBeVisible()
    },
  )

  test.each([
    {
      name: "simple",
      template: `
        <div
          q-json-viewer
          #viewer="jsonViewerRoot"
          [data]="data"
          [expandedValue]="expandedValue()"
          (expandedValueChanged)="expandedValue.set($event.expandedValue); onExpandedValueChanged($event)"
        ></div>
      `,
    },
    {
      name: "composite",
      template: `
        <div
          q-json-viewer-root
          #viewer="jsonViewerRoot"
          [data]="data"
          [expandedValue]="expandedValue()"
          (expandedValueChanged)="expandedValue.set($event.expandedValue); onExpandedValueChanged($event)"
        >
          <div q-json-viewer-tree></div>
        </div>
      `,
    },
  ])(
    "$name exposes its collection and follows controlled expansion",
    async ({template}) => {
      const expandedValue = signal<string[]>([])
      const onExpandedValueChanged = vi.fn()
      const rootValue = nodeToValue({
        keyPath: ["$"],
        type: "object",
        value: data,
      })

      await render(
        `
          <button (click)="expandedValue.set(viewer.collection().getBranchValues())">
            Expand all
          </button>
          <button (click)="expandedValue.set([])">Collapse all</button>
          ${template}
        `,
        {
          componentProperties: {
            data,
            expandedValue,
            onExpandedValueChanged,
          },
          imports: [JsonViewerModule],
        },
      )

      const theme = page.getByText('"dark"', {exact: true})
      await expect.element(theme).not.toBeVisible()
      await page.getByRole("button", {name: "Expand all"}).click()
      await expect.element(theme).toBeVisible()

      await page.getByText("settings", {exact: true}).click()
      await expect
        .poll(() => onExpandedValueChanged)
        .toHaveBeenCalledWith(
          expect.objectContaining({expandedValue: [rootValue]}),
        )
      await expect.element(theme).not.toBeVisible()

      await page.getByText("settings", {exact: true}).click()
      await expect.element(theme).toBeVisible()

      await page.getByRole("button", {name: "Collapse all"}).click()
      await expect.element(theme).not.toBeVisible()
      await expect
        .element(page.getByText("settings", {exact: true}))
        .not.toBeVisible()
    },
  )

  test.each(["simple", "composite"])(
    "%s updates displayed data when the data input changes",
    async (variant) => {
      await render(
        `
        <button (click)="data.set('after')">Replace data</button>
        ${variant === "simple" ? '<div q-json-viewer [data]="data()"></div>' : '<div q-json-viewer-root [data]="data()"><div q-json-viewer-tree></div></div>'}
      `,
        {
          componentProperties: {data: signal("before")},
          imports: [JsonViewerModule],
        },
      )

      await expect
        .element(page.getByRole("treeitem", {name: '"before"'}))
        .toBeVisible()
      await page.getByRole("button", {name: "Replace data"}).click()
      await expect
        .element(page.getByRole("treeitem", {name: '"after"'}))
        .toBeVisible()
      await expect
        .element(page.getByRole("treeitem", {name: '"before"'}))
        .not.toBeInTheDocument()
    },
  )

  test.each(["simple", "composite"])(
    "%s updates key quotes when preview options change",
    async (variant) => {
      await render(
        `
        <button (click)="quotesOnKeys.set(true)">Quote keys</button>
        ${variant === "simple" ? '<div q-json-viewer [data]="data" [defaultExpandedDepth]="2" [quotesOnKeys]="quotesOnKeys()"></div>' : '<div q-json-viewer-root [data]="data" [defaultExpandedDepth]="2" [quotesOnKeys]="quotesOnKeys()"><div q-json-viewer-tree></div></div>'}
      `,
        {
          componentProperties: {data, quotesOnKeys: signal(false)},
          imports: [JsonViewerModule],
        },
      )

      await expect.element(page.getByText("theme", {exact: true})).toBeVisible()
      await page.getByRole("button", {name: "Quote keys"}).click()
      await expect
        .element(page.getByText('"theme"', {exact: true}))
        .toBeVisible()
    },
  )
})
