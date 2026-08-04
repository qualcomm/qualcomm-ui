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

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Combobox.Root
          collection={stringCollection}
          defaultValue={["Option 2"]}
        >
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.ClearTrigger />
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
          defaultValue={["Option 2"]}
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("clear trigger clears selected value", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await expect.element(input).toHaveValue("Option 2")

        const clearButton = page.getByRole("button", {name: /clear value/i})
        await clearButton.click()

        await expect.element(input).toHaveValue("")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root
          collection={stringCollection}
          defaultValue={["Option 1", "Option 2"]}
          multiple
        >
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.ClearTrigger />
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
          defaultValue={["Option 1", "Option 2"]}
          label="Label"
          multiple
        />
      )
    },
    testCase: (getComponent) => {
      test("clear trigger clears all values in multiple mode", async () => {
        await render(getComponent())

        const clearButton = page.getByRole("button", {name: /clear value/i})
        await clearButton.click()

        const input = page.getByRole("combobox", {name: /label/i})
        await expect.element(input).toHaveValue("")
      })
    },
  },
]

describe("Combobox - Clear", () => {
  runTests(tests)
})
