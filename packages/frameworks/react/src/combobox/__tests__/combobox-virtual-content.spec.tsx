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

const highlightCollection = comboboxCollection({
  items: ["Delta", "Zeta", "Eta"],
})

interface Person {
  id: string
  name: string
  role: string
}

const peopleCollection = comboboxCollection<Person>({
  itemLabel: (item) => item.name,
  items: [
    {id: "ada", name: "Ada Lovelace", role: "Mathematician"},
    {id: "grace", name: "Grace Hopper", role: "Computer Scientist"},
    {id: "katherine", name: "Katherine Johnson", role: "Engineer"},
  ],
  itemValue: (item) => item.id,
})

function renderCompositeVirtualCombobox() {
  return (
    <Combobox.Root collection={stringCollection}>
      <Combobox.Label>Label</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.Trigger />
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.VirtualContent>
            <Combobox.Empty>No results</Combobox.Empty>
          </Combobox.VirtualContent>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  )
}

function renderCustomItem({item, ...itemProps}: any) {
  const person = item as Person

  return (
    <Combobox.Item item={person} {...itemProps}>
      <div>
        <Combobox.ItemText>{person.name}</Combobox.ItemText>
        <span>{person.role}</span>
      </div>
      <Combobox.ItemIndicator />
    </Combobox.Item>
  )
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return renderCompositeVirtualCombobox()
    },
    simple() {
      return <Combobox collection={stringCollection} label="Label" virtual />
    },
    testCase: (getComponent) => {
      test("renders virtual options and selects an option", async () => {
        await render(getComponent())

        await page.getByRole("button", {name: /toggle suggestions/i}).click()

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 2"}))
          .toBeVisible()

        await page.getByRole("option", {name: "Option 2"}).click()

        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("combobox", {name: /label/i}))
          .toHaveValue("Option 2")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={peopleCollection}>
          <Combobox.Label>People</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.VirtualContent renderItem={renderCustomItem}>
                <Combobox.Empty>No people found</Combobox.Empty>
              </Combobox.VirtualContent>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    simple() {
      return (
        <Combobox
          collection={peopleCollection}
          label="People"
          renderItem={renderCustomItem}
          virtual
        />
      )
    },
    testCase: (getComponent) => {
      test("renders custom virtual options and selects by item value", async () => {
        await render(getComponent())

        await page.getByRole("button", {name: /toggle suggestions/i}).click()

        await expect
          .element(page.getByRole("option", {name: /Grace Hopper/}))
          .toBeVisible()
        await expect.element(page.getByText("Computer Scientist")).toBeVisible()

        await page.getByRole("option", {name: /Grace Hopper/}).click()

        await expect
          .element(page.getByRole("combobox", {name: /people/i}))
          .toHaveValue("Grace Hopper")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root
          collection={highlightCollection}
          defaultInputValue="ta"
          defaultOpen
        >
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.VirtualContent highlightMatchingText>
                <Combobox.Empty>No results</Combobox.Empty>
              </Combobox.VirtualContent>
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    simple() {
      return (
        <Combobox
          collection={highlightCollection}
          defaultInputValue="ta"
          defaultOpen
          highlightMatchingText
          label="Label"
          virtual
        />
      )
    },
    testCase: (getComponent) => {
      test("highlights matching text inside virtual options", async () => {
        await render(getComponent())

        const option = page.getByRole("option", {name: "Delta"})
        await expect.element(option).toBeVisible()
        await expect.element(option).toHaveTextContent("Delta")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection} defaultOpen>
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger />
          </Combobox.Control>
          <Portal>
            <Combobox.Positioner>
              <Combobox.VirtualContent
                virtualOptions={{rangeExtractor: () => [1]}}
              />
            </Combobox.Positioner>
          </Portal>
        </Combobox.Root>
      )
    },
    testCase: (getComponent) => {
      test("forwards virtualizer options to choose rendered options", async () => {
        await render(getComponent())

        await expect
          .element(page.getByRole("option", {name: "Option 2"}))
          .toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .not.toBeInTheDocument()
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .not.toBeInTheDocument()
      })
    },
  },
]

describe("Combobox - Virtual Content", () => {
  runTests(tests)
})
