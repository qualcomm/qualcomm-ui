import {useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {comboboxCollection} from "@qualcomm-ui/core/combobox"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Combobox} from "@qualcomm-ui/react/combobox"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

interface ObjectItem {
  name: string
  value: string
}

const objectCollection = comboboxCollection<ObjectItem>({
  itemLabel: (item) => item.name,
  items: [
    {name: "Item 1", value: "1"},
    {name: "Item 2", value: "2"},
    {name: "Item 3", value: "3"},
  ],
  itemValue: (item) => item.value,
})

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Combobox.Root collection={objectCollection}>
          <Combobox.Label>Label</Combobox.Label>
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
      return <Combobox collection={objectCollection} label="Label" />
    },
    testCase: (getComponent) => {
      test("object collection displays label, stores value", async () => {
        await render(getComponent())

        await page.getByRole("button", {name: /toggle suggestions/i}).click()
        await page.getByRole("option", {name: "Item 2"}).click()

        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("combobox", {name: /label/i}))
          .toHaveValue("Item 2")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={objectCollection} defaultValue={["2"]}>
          <Combobox.Label>Label</Combobox.Label>
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
      return (
        <Combobox
          collection={objectCollection}
          defaultValue={["2"]}
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("default value with object collection", async () => {
        await render(getComponent())

        await expect
          .element(page.getByRole("combobox", {name: /label/i}))
          .toHaveValue("Item 2")
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState<string[]>([])
        return (
          <Combobox.Root
            collection={objectCollection}
            onValueChange={(details) => setValue(details.value)}
            value={value}
          >
            <Combobox.Label>Label</Combobox.Label>
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
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [value, setValue] = useState<string[]>([])
        return (
          <Combobox
            collection={objectCollection}
            label="Label"
            onValueChange={(details) => setValue(details.value)}
            value={value}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state with object collection", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        const trigger = page.getByRole("button", {name: /toggle suggestions/i})

        await trigger.click()
        await page.getByRole("option", {name: "Item 2"}).click()
        await expect.element(input).toHaveValue("Item 2")

        await trigger.click()
        await page.getByRole("option", {name: "Item 3"}).click()
        await expect.element(input).toHaveValue("Item 3")
      })
    },
  },
]

describe("Combobox - Collection", () => {
  runTests(tests)
})
