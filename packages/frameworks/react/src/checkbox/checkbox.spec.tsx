import {useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import type {MultiComponentTestCase} from "@qualcomm-ui/react-test-utils"
import {Checkbox} from "@qualcomm-ui/react/checkbox"
import type {DataAttributes} from "@qualcomm-ui/utils/attributes"

const demoLabel = "Demo Label"
const demoHint = "Demo Hint"
const demoError = "Demo Error"

const testIds = {
  control: "switch-control",
  errorText: "error-text",
  hiddenInput: "switch-hidden-input",
  hint: "hint",
  indicator: "switch-indicator",
  label: "switch-label",
  root: "switch-root",
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Checkbox.Root>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{demoLabel}</Checkbox.Label>
        </Checkbox.Root>
      )
    },
    simple() {
      return <Checkbox label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("checked/unchecked state", async () => {
        await render(getComponent())
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
        <Checkbox.Root disabled>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{demoLabel}</Checkbox.Label>
        </Checkbox.Root>
      )
    },
    simple() {
      return <Checkbox disabled label={demoLabel} />
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
      return (
        <Checkbox.Root>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{demoLabel}</Checkbox.Label>
          <Checkbox.Hint>{demoHint}</Checkbox.Hint>
        </Checkbox.Root>
      )
    },
    simple() {
      return <Checkbox hint={demoHint} label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("hint text describes the checkbox while valid", async () => {
        await render(getComponent())

        const hint = page.getByText(demoHint)

        await expect.element(hint).toBeVisible()
        await expect.element(hint).not.toHaveAttribute("hidden")
      })
    },
  },
  {
    composite() {
      return (
        <Checkbox.Root invalid>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{demoLabel}</Checkbox.Label>
          <Checkbox.Hint>{demoHint}</Checkbox.Hint>
          <Checkbox.ErrorText>{demoError}</Checkbox.ErrorText>
        </Checkbox.Root>
      )
    },
    simple() {
      return (
        <Checkbox
          errorText={demoError}
          hint={demoHint}
          invalid
          label={demoLabel}
        />
      )
    },
    testCase: (getComponent) => {
      test("error text replaces hint while invalid", async () => {
        await render(getComponent())

        const input = page.getByLabelText(demoLabel)
        const errorText = page.getByText(demoError)

        await expect.element(errorText).toBeVisible()
        await expect.element(page.getByText(demoHint)).not.toBeVisible()
        await expect.element(input).toHaveAttribute("aria-invalid", "true")
        await expect
          .element(input)
          .toHaveAttribute(
            "aria-labelledby",
            expect.stringContaining(errorText.element().id),
          )
      })
    },
  },
  {
    composite() {
      return (
        <Checkbox.Root>
          <Checkbox.HiddenInput />
          <Checkbox.Control>
            <Checkbox.Indicator data-test-id="checkbox-indicator" />
          </Checkbox.Control>
          <Checkbox.Label>{demoLabel}</Checkbox.Label>
        </Checkbox.Root>
      )
    },
    simple() {
      return (
        <Checkbox
          indicatorProps={
            {
              "data-test-id": "checkbox-indicator",
            } as DataAttributes
          }
          label={demoLabel}
        />
      )
    },
    testCase: (getComponent) => {
      test("indicator", async () => {
        await render(getComponent())

        await expect
          .element(page.getByTestId("checkbox-indicator"))
          .not.toBeVisible()
        await page.getByText(demoLabel).click()
        await expect
          .element(page.getByTestId("checkbox-indicator"))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Checkbox.Root indeterminate>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{demoLabel}</Checkbox.Label>
        </Checkbox.Root>
      )
    },
    simple() {
      return <Checkbox indeterminate label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("indeterminate", async () => {
        await render(getComponent())
        await expect
          .element(page.getByRole("checkbox"))
          .toHaveAttribute("data-state", "indeterminate")
      })
    },
  },
  {
    composite() {
      function Component() {
        const [checked, setChecked] = useState(true)
        return (
          <Checkbox.Root checked={checked} onCheckedChange={setChecked}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{demoLabel}</Checkbox.Label>
          </Checkbox.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [checked, setChecked] = useState(true)
        return (
          <Checkbox
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
        await render(getComponent())
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
          <Checkbox.Root checked={checked} onCheckedChange={setChecked}>
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{demoLabel}</Checkbox.Label>
          </Checkbox.Root>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [checked, setChecked] = useState(false)
        return (
          <Checkbox
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
        await render(getComponent())
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
        <Checkbox.Root defaultChecked>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>{demoLabel}</Checkbox.Label>
        </Checkbox.Root>
      )
    },
    simple() {
      return <Checkbox defaultChecked label={demoLabel} />
    },
    testCase: (getComponent) => {
      test("default checked state", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(demoLabel)).toBeChecked()
        await page.getByText(demoLabel).click()
        await expect.element(page.getByLabelText(demoLabel)).not.toBeChecked()
      })
    },
  },
  {
    composite() {
      return (
        <Checkbox.Root data-test-id={testIds.root} defaultChecked>
          <Checkbox.HiddenInput data-test-id={testIds.hiddenInput} />
          <Checkbox.Control data-test-id={testIds.control}>
            <Checkbox.Indicator data-test-id={testIds.indicator} />
          </Checkbox.Control>
          <Checkbox.Label data-test-id={testIds.label}>
            {demoLabel}
          </Checkbox.Label>
          <Checkbox.Hint data-test-id={testIds.hint}>{demoHint}</Checkbox.Hint>
        </Checkbox.Root>
      )
    },
    simple() {
      return (
        <Checkbox
          controlProps={
            {
              "data-test-id": testIds.control,
            } as DataAttributes
          }
          data-test-id={testIds.root}
          defaultChecked
          hiddenInputProps={
            {
              "data-test-id": testIds.hiddenInput,
            } as DataAttributes
          }
          hint={demoHint}
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
          label={demoLabel}
          labelProps={
            {
              "data-test-id": testIds.label,
            } as DataAttributes
          }
        />
      )
    },
    testCase: (getComponent) => {
      test("parts", async () => {
        await render(getComponent())
        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.hint)).toBeVisible()
        await expect.element(page.getByTestId(testIds.control)).toBeVisible()
        await expect.element(page.getByTestId(testIds.indicator)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.hiddenInput))
          .toBeInTheDocument()
      })
    },
  },
]

describe("Checkbox", () => {
  for (const {composite, simple, testCase} of tests) {
    if (composite) {
      testCase(composite)
    }
    if (simple) {
      testCase(simple)
    }
  }
})
