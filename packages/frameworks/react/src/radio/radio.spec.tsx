import {type HTMLAttributes, useState} from "react"

import {page} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"

import {Radio, RadioGroup} from "@qualcomm-ui/react/radio"
import {type MultiComponentTestCase, runTests} from "@qualcomm-ui/react-test-utils"

const demoGroupLabel = "Radio Group Label"
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
        render(getComponent())

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
        render(getComponent())

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
        render(getComponent())

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
        render(getComponent())

        for (const option of radioOptions) {
          await expect.element(page.getByLabelText(option.label)).toBeDisabled()
        }
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
        render(getComponent())

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
          itemsProps={
            {
              "data-test-id": testIds.items,
            } as HTMLAttributes<HTMLElement>
          }
          label={demoGroupLabel}
          labelProps={
            {
              "data-test-id": testIds.groupLabel,
            } as HTMLAttributes<HTMLElement>
          }
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
        render(getComponent())
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
        render(getComponent())
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
        render(getComponent())

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
        render(getComponent())
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
        render(getComponent())
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
        render(getComponent())
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
            controlProps={
              {
                "data-test-id": testIds.control,
              } as HTMLAttributes<HTMLElement>
            }
            data-test-id={testIds.root}
            hiddenInputProps={
              {
                "data-test-id": testIds.hiddenInput,
              } as HTMLAttributes<HTMLElement>
            }
            label={demoLabel}
            labelProps={
              {
                "data-test-id": testIds.label,
              } as HTMLAttributes<HTMLElement>
            }
            value={demoValue}
          />
        </RadioGroup>
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        render(getComponent())
        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.control)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.hiddenInput))
          .toBeInTheDocument()
      })
    },
  },
]

describe("Radio", () => {
  runTests(tests)
})
