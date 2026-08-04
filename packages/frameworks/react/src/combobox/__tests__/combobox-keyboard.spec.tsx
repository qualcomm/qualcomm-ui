import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

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
      test("ArrowDown, ArrowUp, Home, End navigation", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByRole("option", {name: "Option 2"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{ArrowUp}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{End}")
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{Home}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")
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
      test("loopFocus wraps from last to first", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await userEvent.keyboard("{End}")
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")
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
      test("ArrowUp from focused state opens and highlights last item", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()
        await userEvent.keyboard("{ArrowUp}")

        await expect.element(page.getByRole("listbox")).toBeVisible()
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-highlighted")
      })
    },
  },
]

describe("Combobox - Keyboard Navigation", () => {
  runTests(tests)
})
