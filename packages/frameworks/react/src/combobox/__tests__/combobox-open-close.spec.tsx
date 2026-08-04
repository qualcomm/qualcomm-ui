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
      test("opens and closes dropdown via trigger", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()

        await trigger.click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await userEvent.keyboard("{Escape}")
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
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
      test("opens dropdown on input typing", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()
        await userEvent.keyboard("O")

        await expect.element(page.getByRole("listbox")).toBeVisible()
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
      test("opens dropdown on ArrowDown from focused input", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()
        await userEvent.keyboard("{ArrowDown}")

        await expect.element(page.getByRole("listbox")).toBeVisible()
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
      test("closes dropdown via trigger click while open", async () => {
        await render(getComponent())

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await trigger.click()
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
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
        <Combobox collection={stringCollection} defaultOpen label="Label" />
      )
    },
    testCase: (getComponent) => {
      test("defaultOpen renders with dropdown initially open", async () => {
        await render(getComponent())

        await expect.element(page.getByRole("listbox")).toBeVisible()
      })
    },
  },
]

describe("Combobox - Open/Close", () => {
  runTests(tests)
})
