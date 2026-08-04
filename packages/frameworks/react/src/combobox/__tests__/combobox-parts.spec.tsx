import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {comboboxCollection} from "@qualcomm-ui/core/combobox"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Combobox} from "@qualcomm-ui/react/combobox"
import type {DataAttributes} from "@qualcomm-ui/utils/attributes"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const stringCollection = comboboxCollection({
  items: ["Option 1", "Option 2", "Option 3"],
})

const emptyCollection = comboboxCollection({
  items: [],
})

const testIds = {
  clearTrigger: "combobox-clear-trigger",
  content: "combobox-content",
  control: "combobox-control",
  hint: "combobox-hint",
  label: "combobox-label",
  positioner: "combobox-positioner",
  root: "combobox-root",
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection}>
          <Combobox.Label>Combobox Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Items />
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    simple() {
      return <Combobox collection={stringCollection} label="Combobox Label" />
    },
    testCase: (getComponent) => {
      test("label renders and associates with input", async () => {
        await render(getComponent())

        await expect.element(page.getByText("Combobox Label")).toBeVisible()
        await expect
          .element(page.getByRole("combobox", {name: /combobox label/i}))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection}>
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger />
          </Combobox.Control>
          <Combobox.Hint>This is a hint</Combobox.Hint>
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Items />
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    simple() {
      return (
        <Combobox
          collection={stringCollection}
          hint="This is a hint"
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("hint text renders", async () => {
        await render(getComponent())

        await expect.element(page.getByText("This is a hint")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={emptyCollection} defaultOpen>
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Empty>No results</Combobox.Empty>
                <Combobox.Items />
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    simple() {
      return (
        <Combobox
          collection={emptyCollection}
          defaultOpen
          emptyMessage="No results"
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("empty state renders when collection is empty", async () => {
        await render(getComponent())

        await expect.element(page.getByText("No results")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection}>
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input placeholder="Search..." />
            <Combobox.Trigger />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Items />
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    simple() {
      return (
        <Combobox
          collection={stringCollection}
          inputProps={{placeholder: "Search..."}}
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("placeholder renders on input", async () => {
        await render(getComponent())

        await expect
          .element(page.getByRole("combobox", {name: /label/i}))
          .toHaveAttribute("placeholder", "Search...")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root
          collection={stringCollection}
          data-test-id={testIds.root}
        >
          <Combobox.Label data-test-id={testIds.label}>Label</Combobox.Label>
          <Combobox.Control data-test-id={testIds.control}>
            <Combobox.Input />
            <Combobox.ClearTrigger data-test-id={testIds.clearTrigger} />
            <Combobox.Trigger />
          </Combobox.Control>
          <Combobox.Hint data-test-id={testIds.hint}>Hint text</Combobox.Hint>
          <Portal>
            <Combobox.Positioner data-test-id={testIds.positioner}>
              <Combobox.Content data-test-id={testIds.content}>
                <Combobox.Items />
              </Combobox.Content>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    simple() {
      return (
        <Combobox
          collection={stringCollection}
          contentProps={
            {
              "data-test-id": testIds.content,
            } as DataAttributes
          }
          controlProps={
            {
              "data-test-id": testIds.control,
            } as DataAttributes
          }
          data-test-id={testIds.root}
          hint="Hint text"
          hintProps={
            {
              "data-test-id": testIds.hint,
            } as DataAttributes
          }
          label="Label"
          labelProps={
            {
              "data-test-id": testIds.label,
            } as DataAttributes
          }
          positionerProps={
            {
              "data-test-id": testIds.positioner,
            } as DataAttributes
          }
        />
      )
    },
    testCase: (getComponent) => {
      test("all parts render with correct test ids", async () => {
        await render(getComponent())

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.control)).toBeVisible()
        await expect.element(page.getByTestId(testIds.hint)).toBeVisible()

        await page.getByRole("button", {name: /toggle suggestions/i}).click()

        await expect.element(page.getByTestId(testIds.positioner)).toBeVisible()
        await expect.element(page.getByTestId(testIds.content)).toBeVisible()
      })
    },
  },
]

describe("Combobox - Parts", () => {
  runTests(tests)

  test("context render prop exposes live combobox state", async () => {
    await render(
      <Combobox.Root collection={stringCollection}>
        <Combobox.Label>Context Label</Combobox.Label>
        <Combobox.Context>
          {(context) => (
            <div data-test-id="combobox-context-state">
              {context.open ? "open" : "closed"}
            </div>
          )}
        </Combobox.Context>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger />
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Items />
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>,
    )

    const contextState = page.getByTestId("combobox-context-state")
    await expect.element(contextState).toHaveTextContent("closed")

    await page.getByRole("button", {name: /toggle suggestions/i}).click()
    await expect.element(contextState).toHaveTextContent("open")
  })
})
