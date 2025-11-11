import {useState} from "react"

import {page, userEvent} from "@vitest/browser/context"
import {Star} from "lucide-react"
import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select, type SelectRootProps} from "@qualcomm-ui/react/select"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {type MultiComponentTestCase, runTests} from "@qualcomm-ui/react-test-utils"
import type {DataAttributes} from "@qualcomm-ui/utils/attributes"

const stringCollection = selectCollection({
  items: ["Option 1", "Option 2", "Option 3"],
})

const objectCollection = selectCollection({
  itemLabel: (item) => item.name,
  items: [
    {name: "Item 1", value: "1"},
    {name: "Item 2", value: "2"},
    {name: "Item 3", value: "3"},
  ],
  itemValue: (item) => item.value,
})

const testIds = {
  clearTrigger: "select-clear-trigger",
  content: "select-content",
  control: "select-trigger",
  errorIndicator: "select-error-indicator",
  errorText: "select-error-text",
  hiddenSelect: "select-hidden-select",
  hint: "select-hint",
  indicator: "select-indicator",
  label: "select-label",
  positioner: "select-positioner",
  root: "select-root",
  valueText: "select-value-text",
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} placeholder="Choose one">
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.ClearTrigger />
            <Select.ErrorIndicator />
            <Select.Indicator />
          </Select.Control>
          <Select.HiddenSelect />
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select
          collection={stringCollection}
          label="Select option"
          placeholder="Choose one"
        />
      )
    },
    testCase: (getComponent) => {
      test("opens and closes dropdown", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})
        await expect.element(trigger).toBeVisible()
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
        <Select.Root collection={stringCollection}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return <Select collection={stringCollection} label="Select option" />
    },
    testCase: (getComponent) => {
      test("single selection", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})
        await trigger.click()
        await page.getByRole("option", {name: "Option 2"}).click()

        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
        await expect.element(trigger).toHaveTextContent("Option 2")
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} multiple>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select collection={stringCollection} label="Select option" multiple />
      )
    },
    testCase: (getComponent) => {
      test("multiple selection", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})
        await trigger.click()

        await page.getByRole("option", {name: "Option 1"}).click()
        await expect.element(page.getByRole("listbox")).toBeVisible()

        await page.getByRole("option", {name: "Option 3"}).click()
        await expect.element(trigger).toHaveTextContent("Option 1")
        await expect.element(trigger).toHaveTextContent("Option 3")
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} defaultValue={["Option 3"]}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select
          collection={stringCollection}
          defaultValue={["Option 3"]}
          label="Select option"
        />
      )
    },
    testCase: (getComponent) => {
      test("default value", async () => {
        render(getComponent())

        await expect
          .element(page.getByRole("combobox", {name: /select option/i}))
          .toHaveTextContent("Option 3")
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState<string[]>([])
        return (
          <Select.Root
            collection={stringCollection}
            onValueChange={setValue}
            value={value}
          >
            <Select.Label>Select option</Select.Label>
            <Select.Control>
              <Select.ValueText />
              <Select.Indicator />
            </Select.Control>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  <Select.Items />
                </Select.Content>
              </Select.Positioner>
            </Portal>
            <Select.HiddenSelect />
          </Select.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [value, setValue] = useState<string[]>([])
        return (
          <Select
            collection={stringCollection}
            label="Select option"
            onValueChange={setValue}
            value={value}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})

        await trigger.click()
        await page.getByRole("option", {name: "Option 2"}).click()
        await expect.element(trigger).toHaveTextContent("Option 2")

        await trigger.click()
        await page.getByRole("option", {name: "Option 3"}).click()
        await expect.element(trigger).toHaveTextContent("Option 3")
        await expect.element(trigger).not.toHaveTextContent("Option 2")
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} disabled>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select collection={stringCollection} disabled label="Select option" />
      )
    },
    testCase: (getComponent) => {
      test("disabled state", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})
        await expect.element(trigger).toHaveAttribute("data-disabled")

        await trigger.click({force: true})
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} readOnly>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select collection={stringCollection} label="Select option" readOnly />
      )
    },
    testCase: (getComponent) => {
      test("readonly state", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})
        await expect.element(trigger).toHaveAttribute("data-readonly")

        await trigger.click()
        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} invalid>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.ErrorIndicator />
            <Select.Indicator />
          </Select.Control>
          <Select.ErrorText>This field is required</Select.ErrorText>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select
          collection={stringCollection}
          errorText="This field is required"
          invalid
          label="Select option"
        />
      )
    },
    testCase: (getComponent) => {
      test("invalid state with error text", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})
        await expect.element(trigger).toHaveAttribute("data-invalid")
        await expect
          .element(page.getByText("This field is required"))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Select.Hint>This is a hint</Select.Hint>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select
          collection={stringCollection}
          hint="This is a hint"
          label="Select option"
        />
      )
    },
    testCase: (getComponent) => {
      test("with hint text", async () => {
        render(getComponent())

        await expect.element(page.getByText("This is a hint")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return <Select collection={stringCollection} label="Select option" />
    },
    testCase: (getComponent) => {
      test("with label", async () => {
        render(getComponent())

        await expect.element(page.getByText("Select option")).toBeVisible()
        await expect
          .element(page.getByRole("combobox", {name: /select option/i}))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} icon={Star}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select
          collection={stringCollection}
          icon={Star}
          label="Select option"
        />
      )
    },
    testCase: (getComponent) => {
      test("with trigger icon", async () => {
        render(getComponent())

        await expect
          .element(
            page
              .getByRole("combobox")
              .element()
              .querySelector("[data-test-id='qui-icon']"),
          )
          .toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} defaultValue={["Option 2"]}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.ClearTrigger />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select
          clearable
          collection={stringCollection}
          defaultValue={["Option 2"]}
          label="Select option"
        />
      )
    },
    testCase: (getComponent) => {
      test("clear combobox functionality", async () => {
        render(getComponent())

        const trigger = page.getByRole("combobox", {name: /select option/i})
        await expect.element(trigger).toHaveTextContent("Option 2")

        const clearButton = page.getByRole("button", {name: /clear value/i})
        await expect.element(clearButton).toBeVisible()
        await clearButton.click()

        await expect.element(trigger).not.toHaveTextContent("Option 2")
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return <Select collection={stringCollection} label="Select option" />
    },
    testCase: (getComponent) => {
      test("keyboard navigation", async () => {
        render(getComponent())

        await page.getByRole("combobox", {name: /select option/i}).click()

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{ArrowDown}")
        await expect
          .element(page.getByRole("option", {name: "Option 2"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{Home}")
        await expect
          .element(page.getByRole("option", {name: "Option 1"}))
          .toHaveAttribute("data-highlighted")

        await userEvent.keyboard("{End}")
        await expect
          .element(page.getByRole("option", {name: "Option 3"}))
          .toHaveAttribute("data-highlighted")
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={stringCollection} data-test-id={testIds.root}>
          <Select.Label data-test-id={testIds.label}>
            Select option
          </Select.Label>
          <Select.Control data-test-id={testIds.control}>
            <Select.ValueText data-test-id={testIds.valueText} />
            <Select.ClearTrigger data-test-id={testIds.clearTrigger} />
            <Select.ErrorIndicator data-test-id={testIds.errorIndicator} />
            <Select.Indicator data-test-id={testIds.indicator} />
          </Select.Control>
          <Select.Hint data-test-id={testIds.hint}>Hint text</Select.Hint>
          <Select.ErrorText data-test-id={testIds.errorText}>
            Error text
          </Select.ErrorText>
          <Select.HiddenSelect data-test-id={testIds.hiddenSelect} />
          <Portal>
            <Select.Positioner data-test-id={testIds.positioner}>
              <Select.Content data-test-id={testIds.content}>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      )
    },
    simple() {
      return (
        <Select
          collection={stringCollection}
          contentProps={
            {
              "data-test-id": testIds.content,
            } as DataAttributes
          }
          controlProps={
            {
              "data-test-id": testIds.control,
            } as DataAttributes
          }
          data-test-id={testIds.root}
          errorText="Error text"
          errorTextProps={
            {
              "data-test-id": testIds.errorText,
            } as DataAttributes
          }
          hint="Hint text"
          hintProps={
            {
              "data-test-id": testIds.hint,
            } as DataAttributes
          }
          indicatorProps={
            {
              "data-test-id": testIds.indicator,
            } as DataAttributes
          }
          label="Select option"
          labelProps={
            {
              "data-test-id": testIds.label,
            } as DataAttributes
          }
          positionerProps={
            {
              "data-test-id": testIds.positioner,
            } as DataAttributes
          }
          selectProps={
            {
              "data-test-id": testIds.hiddenSelect,
            } as DataAttributes
          }
          valueTextProps={
            {
              "data-test-id": testIds.valueText,
            } as DataAttributes
          }
        />
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        render(getComponent())

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.control)).toBeVisible()
        await expect.element(page.getByTestId(testIds.valueText)).toBeVisible()
        await expect.element(page.getByTestId(testIds.indicator)).toBeVisible()
        await expect.element(page.getByTestId(testIds.hint)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.errorText))
          .toBeInTheDocument()
        await expect
          .element(page.getByTestId(testIds.hiddenSelect))
          .toBeInTheDocument()

        await page.getByTestId(testIds.control).click()

        await expect.element(page.getByTestId(testIds.positioner)).toBeVisible()
        await expect.element(page.getByTestId(testIds.content)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Select.Root collection={objectCollection}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple() {
      return <Select collection={objectCollection} label="Select option" />
    },
    testCase: (getComponent) => {
      test("object collection selection", async () => {
        render(getComponent())

        await page.getByRole("combobox", {name: /select option/i}).click()
        await page.getByRole("option", {name: "Item 2"}).click()

        await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
        await expect
          .element(page.getByRole("combobox", {name: /select option/i}))
          .toHaveTextContent("Item 2")
      })
    },
  },
  {
    composite(props?: Partial<SelectRootProps>) {
      return (
        <Select.Root collection={stringCollection} {...props}>
          <Select.Label>Select option</Select.Label>
          <Select.Control>
            <Select.ValueText />
            <Select.Indicator />
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.Items />
              </Select.Content>
            </Select.Positioner>
          </Portal>
          <Select.HiddenSelect />
        </Select.Root>
      )
    },
    simple(props?: Partial<SelectRootProps>) {
      return (
        <Select
          collection={stringCollection}
          label="Select option"
          {...props}
        />
      )
    },
    testCase: (getComponent) => {
      test("onValueChange callback", async () => {
        const onValueChange = vi.fn()

        render(getComponent({onValueChange}))

        await page.getByRole("combobox", {name: /select option/i}).click()
        await page.getByRole("option", {name: "Option 1"}).click()

        await expect
          .poll(() => onValueChange)
          .toHaveBeenCalledWith(["Option 1"], {items: ["Option 1"]})
      })
    },
  } satisfies MultiComponentTestCase<Partial<SelectRootProps>>,
]

describe("Select", () => {
  runTests(tests)
})
