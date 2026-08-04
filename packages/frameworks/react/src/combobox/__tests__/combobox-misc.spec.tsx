import {Star} from "lucide-react"
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
        <Combobox.Root collection={stringCollection} openOnClick>
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
        <Combobox collection={stringCollection} label="Label" openOnClick />
      )
    },
    testCase: (getComponent) => {
      test("openOnClick opens dropdown on input click", async () => {
        await render(getComponent())

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()

        await expect.element(page.getByRole("listbox")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Combobox.Root collection={stringCollection} icon={Star}>
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
        <Combobox collection={stringCollection} icon={Star} label="Label" />
      )
    },
    testCase: (getComponent) => {
      test("renders with start icon", async () => {
        await render(getComponent())

        await expect
          .poll(() =>
            page
              .getByRole("combobox")
              .element()
              .closest("[data-combobox-part='control']")
              ?.querySelector("[data-test-id='qui-icon']"),
          )
          .toBeInTheDocument()
      })
    },
  },
]

describe("Combobox - Misc", () => {
  runTests(tests)
})
