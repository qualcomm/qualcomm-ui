import {signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {JsonViewerModule} from "@qualcomm-ui/angular/json-viewer"
import {nodeToValue} from "@qualcomm-ui/utils/json-tree"

const data = {settings: {theme: "dark"}}

const variants = [
  {
    name: "simple",
    template: `<q-json-viewer [data]="data" [defaultExpandedDepth]="2" />`,
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
        <q-json-viewer
          #viewer
          [data]="data"
          [expandedValue]="expandedValue()"
          (expandedValueChange)="expandedValue.set($event); onExpandedValueChange($event)"
        />
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
          (expandedValueChange)="expandedValue.set($event); onExpandedValueChange($event)"
        >
          <div q-json-viewer-tree></div>
        </div>
      `,
    },
  ])(
    "$name exposes its collection and follows controlled expansion",
    async ({template}) => {
      const expandedValue = signal<string[]>([])
      const onExpandedValueChange = vi.fn()
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
          componentProperties: {data, expandedValue, onExpandedValueChange},
          imports: [JsonViewerModule],
        },
      )

      const theme = page.getByText('"dark"', {exact: true})
      await expect.element(theme).not.toBeVisible()
      await page.getByRole("button", {name: "Expand all"}).click()
      await expect.element(theme).toBeVisible()

      await page.getByText("settings", {exact: true}).click()
      await expect
        .poll(() => onExpandedValueChange)
        .toHaveBeenCalledWith([rootValue])
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
        ${variant === "simple" ? '<q-json-viewer [data]="data()" />' : '<div q-json-viewer-root [data]="data()"><div q-json-viewer-tree></div></div>'}
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
        ${variant === "simple" ? '<q-json-viewer [data]="data" [defaultExpandedDepth]="2" [quotesOnKeys]="quotesOnKeys()" />' : '<div q-json-viewer-root [data]="data" [defaultExpandedDepth]="2" [quotesOnKeys]="quotesOnKeys()"><div q-json-viewer-tree></div></div>'}
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
