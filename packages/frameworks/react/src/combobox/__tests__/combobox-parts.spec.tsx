import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {comboboxCollection} from "@qualcomm-ui/core/combobox"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Combobox} from "@qualcomm-ui/react/combobox"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const stringCollection = comboboxCollection({
  items: ["Option 1", "Option 2", "Option 3"],
})

const emptyCollection = comboboxCollection({
  items: [],
})

const groupedCollection = comboboxCollection({
  groupBy: (item) => item.group,
  itemLabel: (item) => item.label,
  items: [
    {group: "Available", label: "Item 1", value: "1"},
    {group: "Available", label: "Item 2", value: "2"},
    {group: "Onboarded", label: "Item 3", value: "3"},
  ],
  itemValue: (item) => item.value,
})

function GroupedCombobox() {
  return (
    <Combobox.Root collection={groupedCollection}>
      <Combobox.Label>Combobox label</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.Trigger />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            {groupedCollection.group().map(([group, items]) => (
              <Combobox.ItemGroup key={group}>
                <Combobox.ItemGroupLabel>{group}</Combobox.ItemGroupLabel>
                {items.map((item) => (
                  <Combobox.Item key={item.value} item={item}>
                    <Combobox.ItemText>{item.label}</Combobox.ItemText>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                ))}
              </Combobox.ItemGroup>
            ))}
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

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
          contentProps={{
            "data-test-id": testIds.content,
          }}
          controlProps={{
            "data-test-id": testIds.control,
          }}
          data-test-id={testIds.root}
          hint="Hint text"
          hintProps={{
            "data-test-id": testIds.hint,
          }}
          label="Label"
          labelProps={{
            "data-test-id": testIds.label,
          }}
          positionerProps={{
            "data-test-id": testIds.positioner,
          }}
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

  test("item groups use their labels as accessible names", async () => {
    await render(<GroupedCombobox />)

    await page.getByRole("button", {name: /toggle suggestions/i}).click()

    const group = page.getByRole("group", {name: "Available"})
    const label = page.getByText("Available")
    const labelId = label.element().getAttribute("id")

    expect(labelId).toBeTruthy()
    await expect.element(group).toHaveAccessibleName("Available")
    await expect.element(group).toHaveAttribute("aria-labelledby", labelId!)
  })

  test("options inside item groups remain selectable", async () => {
    await render(<GroupedCombobox />)

    const input = page.getByRole("combobox", {name: "Combobox label"})
    await page.getByRole("button", {name: /toggle suggestions/i}).click()
    await page.getByRole("option", {name: "Item 2"}).click()

    await expect.element(input).toHaveValue("Item 2")
  })

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
