import {useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

import {Radio} from "./index"
import {RadioGroup} from "./radio-group"

const demoGroupLabel = "Radio Group Label"
const demoGroupError = "Demo Group Error"
const demoGroupHint = "Demo Group Hint"
const demoHint = "Demo Hint"
const demoLabel = "Demo Label"
const demoValue = "demo-value"

const radioOptions = [
  {label: "Option 1", value: "option1"},
  {label: "Option 2", value: "option2"},
  {label: "Option 3", value: "option3"},
]

const testIds = {
  control: "radio-control",
  errorText: "error-text",
  group: "radio-group-root",
  groupLabel: "radio-group-label",
  hiddenInput: "radio-hidden-input",
  items: "radio-group-items",
  label: "radio-label",
  root: "radio-root",
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <RadioGroup.Root>
          <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
          <RadioGroup.Items>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup label={demoGroupLabel}>
          {radioOptions.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("renders all radio options", async () => {
        await render(getComponent())

        await expect.element(page.getByText(demoGroupLabel)).toBeVisible()

        for (const option of radioOptions) {
          await expect.element(page.getByLabelText(option.label)).toBeVisible()
        }
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root defaultValue="option2">
          <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
          <RadioGroup.Items>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup defaultValue="option2" label={demoGroupLabel}>
          {radioOptions.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("default value selection", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText("Option 1")).not.toBeChecked()
        await expect.element(page.getByLabelText("Option 2")).toBeChecked()
        await expect.element(page.getByLabelText("Option 3")).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root defaultValue="option1">
          <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
          <RadioGroup.Items>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup defaultValue="option1" label={demoGroupLabel}>
          {radioOptions.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("radio group selection behavior", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText("Option 1")).toBeChecked()
        await expect.element(page.getByLabelText("Option 2")).not.toBeChecked()
        await expect.element(page.getByLabelText("Option 3")).not.toBeChecked()

        await page.getByText("Option 2").click()

        await expect.element(page.getByLabelText("Option 1")).not.toBeChecked()
        await expect.element(page.getByLabelText("Option 2")).toBeChecked()
        await expect.element(page.getByLabelText("Option 3")).not.toBeChecked()

        await page.getByText("Option 3").click()

        await expect.element(page.getByLabelText("Option 1")).not.toBeChecked()
        await expect.element(page.getByLabelText("Option 2")).not.toBeChecked()
        await expect.element(page.getByLabelText("Option 3")).toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root disabled>
          <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
          <RadioGroup.Items>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup disabled label={demoGroupLabel}>
          {radioOptions.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("disabled state", async () => {
        await render(getComponent())

        for (const option of radioOptions) {
          await expect.element(page.getByLabelText(option.label)).toBeDisabled()
        }
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root>
          <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
          <RadioGroup.Items>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
          <RadioGroup.Hint>{demoGroupHint}</RadioGroup.Hint>
        </RadioGroup.Root>
      )
    },
    testCase: (getComponent) => {
      test("group hint text describes the radio group while valid", async () => {
        await render(getComponent())

        const group = page.getByRole("radiogroup")
        const hint = page.getByText(demoGroupHint)

        await expect.element(hint).toBeVisible()
        await expect.element(hint).not.toHaveAttribute("hidden")
        await expect.element(group).not.toHaveAttribute("aria-invalid", "true")
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root invalid>
          <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
          <RadioGroup.Items>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
          <RadioGroup.Hint>{demoGroupHint}</RadioGroup.Hint>
          <RadioGroup.ErrorText>{demoGroupError}</RadioGroup.ErrorText>
        </RadioGroup.Root>
      )
    },
    testCase: (getComponent) => {
      test("group error text replaces hint while invalid", async () => {
        await render(getComponent())

        const group = page.getByRole("radiogroup")
        const errorText = page.getByText(demoGroupError)

        await expect.element(errorText).toBeVisible()
        await expect.element(page.getByText(demoGroupHint)).not.toBeVisible()
        await expect.element(group).toHaveAttribute("aria-invalid", "true")
        await expect
          .element(group)
          .toHaveAttribute("aria-describedby", errorText.element().id)
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root defaultValue="option1">
          <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
          <RadioGroup.RadioContext>
            {(context) => (
              <div data-test-id="radio-context-value">
                {context.value ?? "none"}
              </div>
            )}
          </RadioGroup.RadioContext>
          <RadioGroup.Items>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup defaultValue="option1" label={demoGroupLabel}>
          <RadioGroup.RadioContext>
            {(context) => (
              <div data-test-id="radio-context-value">
                {context.value ?? "none"}
              </div>
            )}
          </RadioGroup.RadioContext>
          {radioOptions.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("context render prop exposes the selected value", async () => {
        await render(getComponent())

        const contextValue = page.getByTestId("radio-context-value")
        await expect.element(contextValue).toHaveTextContent("option1")

        await page.getByText("Option 3").click()
        await expect.element(contextValue).toHaveTextContent("option3")
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState<string | null>("option1")
        return (
          <RadioGroup.Root onValueChange={setValue} value={value}>
            <RadioGroup.Label>{demoGroupLabel}</RadioGroup.Label>
            <RadioGroup.Items>
              {radioOptions.map((option) => (
                <Radio
                  key={option.value}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </RadioGroup.Items>
          </RadioGroup.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [value, setValue] = useState<string | null>("option1")
        return (
          <RadioGroup
            label={demoGroupLabel}
            onValueChange={setValue}
            value={value}
          >
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText("Option 1")).toBeChecked()

        await page.getByText("Option 3").click()

        await expect.element(page.getByLabelText("Option 1")).not.toBeChecked()
        await expect.element(page.getByLabelText("Option 3")).toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root data-test-id={testIds.group} defaultValue="option1">
          <RadioGroup.Label data-test-id={testIds.groupLabel}>
            {demoGroupLabel}
          </RadioGroup.Label>
          <RadioGroup.Items data-test-id={testIds.items}>
            {radioOptions.map((option) => (
              <Radio
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup.Items>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup
          data-test-id={testIds.group}
          defaultValue="option1"
          itemsProps={{
            "data-test-id": testIds.items,
          }}
          label={demoGroupLabel}
          labelProps={{
            "data-test-id": testIds.groupLabel,
          }}
        >
          {radioOptions.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        await render(getComponent())
        await expect.element(page.getByTestId(testIds.group)).toBeVisible()
        await expect.element(page.getByTestId(testIds.groupLabel)).toBeVisible()
        await expect.element(page.getByTestId(testIds.items)).toBeVisible()
      })
    },
  },

  {
    composite() {
      return (
        <RadioGroup.Root name="group">
          <Radio.Root value={demoValue}>
            <Radio.HiddenInput />
            <Radio.Control />
            <Radio.Label>{demoLabel}</Radio.Label>
          </Radio.Root>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup>
          <Radio label={demoLabel} value={demoValue} />
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("checked/unchecked state", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root disabled name="group">
          <Radio.Root value={demoValue}>
            <Radio.HiddenInput />
            <Radio.Control />
            <Radio.Label>{demoLabel}</Radio.Label>
          </Radio.Root>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup disabled>
          <Radio label={demoLabel} value={demoValue} />
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("disabled", async () => {
        await render(getComponent())

        await expect.element(page.getByLabelText(demoLabel)).toBeDisabled()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState<string | null>(demoValue)
        return (
          <RadioGroup.Root name="group" onValueChange={setValue} value={value}>
            <Radio.Root value={demoValue}>
              <Radio.HiddenInput />
              <Radio.Control />
              <Radio.Label>{demoLabel}</Radio.Label>
            </Radio.Root>
          </RadioGroup.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [value, setValue] = useState<string | null>(demoValue)
        return (
          <RadioGroup onValueChange={setValue} value={value}>
            <Radio label={demoLabel} value={demoValue} />
          </RadioGroup>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state - initially selected", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState<string | null>(null)
        return (
          <RadioGroup.Root name="group" onValueChange={setValue} value={value}>
            <Radio.Root value={demoValue}>
              <Radio.HiddenInput />
              <Radio.Control />
              <Radio.Label>{demoLabel}</Radio.Label>
            </Radio.Root>
          </RadioGroup.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [value, setValue] = useState<string | null>(null)
        return (
          <RadioGroup onValueChange={setValue} value={value}>
            <Radio label={demoLabel} value={demoValue} />
          </RadioGroup>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state - initially unselected", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root defaultValue={demoValue} name="group">
          <Radio.Root value={demoValue}>
            <Radio.HiddenInput />
            <Radio.Control />
            <Radio.Label>{demoLabel}</Radio.Label>
          </Radio.Root>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup defaultValue={demoValue}>
          <Radio label={demoLabel} value={demoValue} />
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("default selected state", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root defaultValue={demoValue} name="group">
          <Radio.Root data-test-id={testIds.root} value={demoValue}>
            <Radio.HiddenInput data-test-id={testIds.hiddenInput} />
            <Radio.Control data-test-id={testIds.control} />
            <Radio.Label data-test-id={testIds.label}>{demoLabel}</Radio.Label>
          </Radio.Root>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup defaultValue={demoValue}>
          <Radio
            controlProps={{
              "data-test-id": testIds.control,
            }}
            data-test-id={testIds.root}
            hiddenInputProps={{
              "data-test-id": testIds.hiddenInput,
            }}
            label={demoLabel}
            labelProps={{
              "data-test-id": testIds.label,
            }}
            value={demoValue}
          />
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        await render(getComponent())
        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.control)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.hiddenInput))
          .toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      return (
        <RadioGroup.Root name="group">
          <Radio.Root value={demoValue}>
            <Radio.HiddenInput />
            <Radio.Control />
            <Radio.Label>{demoLabel}</Radio.Label>
            <Radio.Hint>{demoHint}</Radio.Hint>
          </Radio.Root>
        </RadioGroup.Root>
      )
    },
    simple() {
      return (
        <RadioGroup>
          <Radio hint={demoHint} label={demoLabel} value={demoValue} />
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("hint is visible", async () => {
        await render(getComponent())
        await expect.element(page.getByText(demoHint)).toBeVisible()
      })
    },
  },
]

describe("Radio", () => {
  runTests(tests)
})
