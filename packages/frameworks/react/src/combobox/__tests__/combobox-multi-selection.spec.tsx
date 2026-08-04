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
        <Combobox.Root collection={stringCollection} multiple>
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
      return <Combobox collection={stringCollection} label="Label" multiple />
    },
    testCase: (getComponent) => {
      test("multiple selection toggles items and stays open", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await page.getByRole("option", {name: "Option 3"}).click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-state", "checked")
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-state", "checked")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection} multiple>
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
      return <Combobox collection={stringCollection} label="Label" multiple />
    },
    testCase: (getComponent) => {
      test("multiple selection deselects on second click", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-state", "checked")

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-state", "unchecked")
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root closeOnSelect={false} collection={stringCollection}>
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
          closeOnSelect={false}
          collection={stringCollection}
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("closeOnSelect false keeps dropdown open in single mode", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(page.getByRole("listbox")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection} multiple>
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
      return <Combobox collection={stringCollection} label="Label" multiple />
    },
    testCase: (getComponent) => {
      test("selectionBehavior clear clears input in multiple mode", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(input).toHaveValue("")
      })
    },
  },
]

describe("Combobox - Multiple Selection", () => {
  runTests(tests)
})
