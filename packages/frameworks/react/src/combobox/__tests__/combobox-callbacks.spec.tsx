import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {comboboxCollection} from "@qualcomm-ui/core/combobox"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {Combobox, type ComboboxRootProps} from "@qualcomm-ui/react/combobox"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const stringCollection = comboboxCollection({
  items: ["Option 1", "Option 2", "Option 3"],
})

const tests: MultiComponentTestCase<Partial<ComboboxRootProps<string>>>[] = [
  {
    composite(props?: Partial<ComboboxRootProps<string>>) {
      return (
        <Combobox.Root collection={stringCollection} {...props}>
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
    simple(props?: Partial<ComboboxRootProps<string>>) {
      return <Combobox collection={stringCollection} label="Label" {...props} />
    },
    testCase: (getComponent) => {
      test("onValueChange fires on selection", async () => {
        const onValueChange = vi.fn()

        await render(getComponent({onValueChange}))

        await page.getByRole("button", {name: /toggle suggestions/i}).click()
        await page.getByRole("option", {name: "Option 1"}).click()

        await expect
          .poll(() => onValueChange)
          .toHaveBeenCalledWith({
            items: ["Option 1"],
            value: ["Option 1"],
          })
      })
    },
  } satisfies MultiComponentTestCase<Partial<ComboboxRootProps<string>>>,
  {
    composite(props?: Partial<ComboboxRootProps<string>>) {
      return (
        <Combobox.Root collection={stringCollection} {...props}>
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
    simple(props?: Partial<ComboboxRootProps<string>>) {
      return <Combobox collection={stringCollection} label="Label" {...props} />
    },
    testCase: (getComponent) => {
      test("onInputValueChange fires on typing", async () => {
        const onInputValueChange = vi.fn()

        await render(getComponent({onInputValueChange}))

        const input = page.getByRole("combobox", {name: /label/i})
        await input.click()
        await userEvent.keyboard("t")

        await expect.poll(() => onInputValueChange).toHaveBeenCalled()
      })
    },
  } satisfies MultiComponentTestCase<Partial<ComboboxRootProps<string>>>,
  {
    composite(props?: Partial<ComboboxRootProps<string>>) {
      return (
        <Combobox.Root collection={stringCollection} {...props}>
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
    simple(props?: Partial<ComboboxRootProps<string>>) {
      return <Combobox collection={stringCollection} label="Label" {...props} />
    },
    testCase: (getComponent) => {
      test("onOpenChange fires on open and close", async () => {
        const onOpenChange = vi.fn()

        await render(getComponent({onOpenChange}))

        const trigger = page.getByRole("button", {name: /toggle suggestions/i})
        await trigger.click()
        await expect
          .poll(() => onOpenChange)
          .toHaveBeenCalledWith(expect.objectContaining({open: true}))

        await userEvent.keyboard("{Escape}")
        await expect
          .poll(() => onOpenChange)
          .toHaveBeenCalledWith(expect.objectContaining({open: false}))
      })
    },
  } satisfies MultiComponentTestCase<Partial<ComboboxRootProps<string>>>,
  {
    composite(props?: Partial<ComboboxRootProps<string>>) {
      return (
        <Combobox.Root collection={stringCollection} {...props}>
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
    simple(props?: Partial<ComboboxRootProps<string>>) {
      return <Combobox collection={stringCollection} label="Label" {...props} />
    },
    testCase: (getComponent) => {
      test("onHighlightChange fires on keyboard navigation", async () => {
        const onHighlightChange = vi.fn()

        await render(getComponent({onHighlightChange}))

        await page.getByRole("button", {name: /toggle suggestions/i}).click()
        await userEvent.keyboard("{ArrowDown}")

        await expect
          .poll(() => onHighlightChange)
          .toHaveBeenCalledWith(
            expect.objectContaining({highlightedValue: "Option 1"}),
          )
      })
    },
  } satisfies MultiComponentTestCase<Partial<ComboboxRootProps<string>>>,
  {
    composite(props?: Partial<ComboboxRootProps<string>>) {
      return (
        <Combobox.Root collection={stringCollection} {...props}>
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
    simple(props?: Partial<ComboboxRootProps<string>>) {
      return <Combobox collection={stringCollection} label="Label" {...props} />
    },
    testCase: (getComponent) => {
      test("onSelect fires when item is selected", async () => {
        const onSelect = vi.fn()

        await render(getComponent({onSelect}))

        await page.getByRole("button", {name: /toggle suggestions/i}).click()
        await page.getByRole("option", {name: "Option 1"}).click()

        await expect
          .poll(() => onSelect)
          .toHaveBeenCalledWith({
            itemValue: "Option 1",
            value: ["Option 1"],
          })
      })
    },
  } satisfies MultiComponentTestCase<Partial<ComboboxRootProps<string>>>,
]

describe("Combobox - Callbacks", () => {
  runTests(tests)
})
