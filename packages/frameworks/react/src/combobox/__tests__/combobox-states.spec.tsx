import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
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
        <Combobox.Root collection={stringCollection} disabled>
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
      return <Combobox collection={stringCollection} disabled label="Label" />
    },
    testCase: (getComponent) => {
      test("disabled state prevents interactions", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await expect.element(input).toBeDisabled()

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click({force: true})
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection} readOnly>
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
      return <Combobox collection={stringCollection} label="Label" readOnly />
    },
    testCase: (getComponent) => {
      test("readOnly state prevents editing", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await expect.element(input).toHaveAttribute("readOnly")

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await expect.element(trigger).toHaveAttribute("data-readonly")

        await trigger.click()
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection} invalid>
          <Combobox.Label>Label</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.ErrorIndicator />
            <Combobox.Trigger />
          </Combobox.Control>
          <Combobox.ErrorText>This field is required</Combobox.ErrorText>
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
          errorText="This field is required"
          invalid
          label="Label"
        />
      )
    },
    testCase: (getComponent) => {
      test("invalid state with error text", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await expect.element(input).toHaveAttribute("data-invalid")
        await expect
          .element(page.getByText("This field is required"))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection} required>
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
      return <Combobox collection={stringCollection} label="Label" required />
    },
    testCase: (getComponent) => {
      test("required state", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await expect.element(input).toBeRequired()
      })
    },
  },
]

describe("Combobox - States", () => {
  runTests(tests)
})
