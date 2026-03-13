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
        <Combobox.Root
          collection={stringCollection}
          inputBehavior="autohighlight"
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
    },
    simple() {
      return (
        <Combobox
          collection={stringCollection}
          inputBehavior="autohighlight"
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("inputBehavior autohighlight auto-highlights first item", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()
        await userEvent.keyboard("O")

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root
          collection={stringCollection}
          selectionBehavior="preserve"
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
    },
    simple() {
      return (
        <Combobox
          collection={stringCollection}
          label="Label"
          selectionBehavior="preserve"
        />
      )
    },
    testCase: (getComponent) => {
      test("selectionBehavior preserve keeps input text after selection", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()
        await userEvent.keyboard("Op")

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await page.getByRole("option", {name: "Option 1"}).click()

        await expect.element(input).toHaveValue("Op")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root allowCustomValue collection={stringCollection}>
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
          allowCustomValue
          collection={stringCollection}
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("allowCustomValue permits non-collection input", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()
        await userEvent.keyboard("Custom")
        await userEvent.keyboard("{Escape}")

        await expect.element(input).toHaveValue("Custom")
      })
    },
  },
]

describe("Combobox - Input Behavior", () => {
  runTests(tests)
})
