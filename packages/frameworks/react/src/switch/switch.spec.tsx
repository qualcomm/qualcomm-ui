import {type HTMLAttributes, type InputHTMLAttributes, useState} from "react"

import {page} from "@vitest/browser/context"
import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"

import {Switch} from "@qualcomm-ui/react/switch"
import {type MultiComponentTest, runTests} from "@qualcomm-ui/react-test-utils"

const demoLabel = "Demo Label"

const testIds = {
  control: "switch-control",
  errorText: "error-text",
  hiddenInput: "switch-hidden-input",
  label: "switch-label",
  root: "switch-root",
  thumb: "switch-thumb",
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      return (
        <Switch.Root>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("checked/unchecked state", async () => {
        render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root disabled>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch disabled label={demoLabel} />
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
      return (
        <Switch.Root data-test-id={testIds.root}>
          <Switch.HiddenInput data-test-id={testIds.hiddenInput} />
          <Switch.Control data-test-id={testIds.control}>
            <Switch.Thumb data-test-id={testIds.thumb} />
          </Switch.Control>
          <Switch.Label data-test-id={testIds.label}>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return (
        <Switch
          controlProps={
            {
              "data-test-id": testIds.control,
            } as HTMLAttributes<HTMLElement>
          }
          data-test-id={testIds.root}
          hiddenInputProps={
            {
              "data-test-id": testIds.hiddenInput,
            } as InputHTMLAttributes<HTMLInputElement>
          }
          label={demoLabel}
          labelProps={
            {
              "data-test-id": testIds.label,
            } as HTMLAttributes<HTMLElement>
          }
          thumbProps={
            {
              "data-test-id": testIds.thumb,
            } as HTMLAttributes<HTMLElement>
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
        await expect.element(page.getByTestId(testIds.thumb)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.hiddenInput))
          .toBeInTheDocument()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [checked, setChecked] = useState(true)
        return (
          <Switch.Root checked={checked} onCheckedChange={setChecked}>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [checked, setChecked] = useState(true)
        return (
          <Switch
            checked={checked}
            label={demoLabel}
            onCheckedChange={setChecked}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state - initially checked", async () => {
        render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [checked, setChecked] = useState(false)
        return (
          <Switch.Root checked={checked} onCheckedChange={setChecked}>
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>{demoLabel}</Switch.Label>
          </Switch.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [checked, setChecked] = useState(false)
        return (
          <Switch
            checked={checked}
            label={demoLabel}
            onCheckedChange={setChecked}
          />
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled state - initially unchecked", async () => {
        render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <Switch.Root defaultChecked>
          <Switch.HiddenInput />
          <Switch.Control />
          <Switch.Label>{demoLabel}</Switch.Label>
        </Switch.Root>
      )
    },
    simple() {
      return <Switch defaultChecked label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("default checked state", async () => {
        render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
]

describe("Switch", () => {
  runTests(tests)
})
