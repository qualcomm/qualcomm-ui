import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"
import {render} from "vitest-browser-react"

import {comboboxCollection} from "@qualcomm-ui/core/combobox"
import {Combobox} from "@qualcomm-ui/react/combobox"
import {Portal} from "@qualcomm-ui/react-core/portal"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const stringCollection = comboboxCollection({
  items: ["Option 1", "Option 2", "Option 3"],
})

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection}>
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
      return <Combobox collection={stringCollection} label="Label" />
    },
    testCase: (getComponent) => {
      test("selects item by click", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()
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
        <Combobox.Root collection={stringCollection}>
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
      return <Combobox collection={stringCollection} label="Label" />
    },
    testCase: (getComponent) => {
      test("selects item via Enter key", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await userEvent.keyboard("{ArrowDown}")
        await userEvent.keyboard("{ArrowDown}")
        await userEvent.keyboard("{Enter}")

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
        <Combobox.Root collection={stringCollection}>
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
      return <Combobox collection={stringCollection} label="Label" />
    },
    testCase: (getComponent) => {
      test("single selection replaces previous", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        const trigger = page.getByRole("button", {name: /toggle suggestions/i})

        await trigger.click()
        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(input).toHaveValue("Option 1")

        await trigger.click()
        await page.getByRole("option", {name: "Option 3"}).click()
        await expect.element(input).toHaveValue("Option 3")
      })
    },
  },
]

describe("Combobox - Single Selection", () => {
  runTests(tests)
})
