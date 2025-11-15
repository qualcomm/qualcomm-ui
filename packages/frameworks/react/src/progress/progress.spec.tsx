import {type HTMLAttributes, useState} from "react"

import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"
import {render} from "vitest-browser-react"

import {Progress} from "@qualcomm-ui/react/progress"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const testLabel = "Test Progress"
const errorMessage = "Error occurred"

const testIds = {
  bar: "progress-bar",
  errorText: "progress-error-text",
  label: "progress-label",
  root: "progress-root",
  track: "progress-track",
  valueText: "progress-value-text",
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <Progress.Root>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
        </Progress.Root>
      )
    },
    simple() {
      return <Progress label={testLabel} />
    },
    testCase: (getComponent) => {
      test("Basic accessibility", async () => {
        await render(getComponent())
        await expect.element(page.getByLabelText(testLabel)).toBeVisible()
        await expect
          .element(page.getByLabelText(testLabel))
          .toHaveRole("progressbar")
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root value={50}>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
        </Progress.Root>
      )
    },
    simple() {
      return <Progress label={testLabel} value={50} />
    },
    testCase: (getComponent) => {
      test("Progress with value", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "50")
        await expect.element(progressbar).toHaveAttribute("aria-valuemin", "0")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuemax", "100")
        await expect
          .element(progressbar)
          .toHaveAttribute("data-state", "loading")
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root value={100}>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
        </Progress.Root>
      )
    },
    simple() {
      return <Progress label={testLabel} value={100} />
    },
    testCase: (getComponent) => {
      test("Complete progress", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuenow", "100")
        await expect
          .element(progressbar)
          .toHaveAttribute("data-state", "complete")
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
        </Progress.Root>
      )
    },
    simple() {
      return <Progress label={testLabel} />
    },
    testCase: (getComponent) => {
      test("Indeterminate progress", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).not.toHaveAttribute("aria-valuenow")
        await expect
          .element(progressbar)
          .toHaveAttribute("data-state", "indeterminate")
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root max={200} min={10} value={50}>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
        </Progress.Root>
      )
    },
    simple() {
      return <Progress label={testLabel} max={200} min={10} value={50} />
    },
    testCase: (getComponent) => {
      test("Custom min/max values", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "50")
        await expect.element(progressbar).toHaveAttribute("aria-valuemin", "10")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuemax", "200")
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root invalid>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
          <Progress.ErrorText>{errorMessage}</Progress.ErrorText>
        </Progress.Root>
      )
    },
    simple() {
      return <Progress errorText={errorMessage} invalid label={testLabel} />
    },
    testCase: (getComponent) => {
      test("Invalid progress with error text", async () => {
        await render(getComponent())
        await expect.element(page.getByText(errorMessage)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root value={75}>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.ValueText>
            <Progress.Context>
              {(api) => `${api.value}/${api.max}`}
            </Progress.Context>
          </Progress.ValueText>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
        </Progress.Root>
      )
    },
    simple() {
      return (
        <Progress
          label={testLabel}
          value={75}
          valueText={(api) => `${api.value}/${api.max}`}
        />
      )
    },
    testCase: (getComponent) => {
      test("Progress with value text", async () => {
        await render(getComponent())
        await expect.element(page.getByText("75/100")).toBeVisible()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState<number | undefined>(25)
        return (
          <div>
            <Progress.Root onValueChange={setValue} value={value}>
              <Progress.Label>{testLabel}</Progress.Label>
              <Progress.Track>
                <Progress.Bar />
              </Progress.Track>
            </Progress.Root>
            <button onClick={() => setValue(75)} type="button">
              Update Progress
            </button>
          </div>
        )
      }
      return <Component />
    },
    simple() {
      function Component() {
        const [value, setValue] = useState<number | undefined>(25)
        return (
          <div>
            <Progress
              label={testLabel}
              onValueChange={setValue}
              value={value}
            />
            <button onClick={() => setValue(75)} type="button">
              Update Progress
            </button>
          </div>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("Controlled progress value", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "25")
        await page.getByText("Update Progress").click()
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "75")
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root defaultValue={30}>
          <Progress.Label>{testLabel}</Progress.Label>
          <Progress.Track>
            <Progress.Bar />
          </Progress.Track>
        </Progress.Root>
      )
    },
    simple() {
      return <Progress defaultValue={30} label={testLabel} />
    },
    testCase: (getComponent) => {
      test("Default value", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "30")
      })
    },
  },
  {
    composite() {
      return (
        <Progress.Root data-test-id={testIds.root} invalid value={60}>
          <Progress.Label data-test-id={testIds.label}>
            {testLabel}
          </Progress.Label>
          <Progress.ValueText data-test-id={testIds.valueText}>
            60%
          </Progress.ValueText>
          <Progress.Track data-test-id={testIds.track}>
            <Progress.Bar data-test-id={testIds.bar} />
          </Progress.Track>
          <Progress.ErrorText data-test-id={testIds.errorText}>
            {errorMessage}
          </Progress.ErrorText>
        </Progress.Root>
      )
    },
    simple() {
      return (
        <Progress
          barProps={
            {
              "data-test-id": testIds.bar,
            } as HTMLAttributes<HTMLElement>
          }
          data-test-id={testIds.root}
          errorText={errorMessage}
          errorTextProps={
            {
              "data-test-id": testIds.errorText,
            } as HTMLAttributes<HTMLElement>
          }
          invalid
          label={testLabel}
          labelProps={
            {
              "data-test-id": testIds.label,
            } as HTMLAttributes<HTMLElement>
          }
          trackProps={
            {
              "data-test-id": testIds.track,
            } as HTMLAttributes<HTMLElement>
          }
          value={60}
          valueText="60%"
          valueTextProps={
            {
              "data-test-id": testIds.valueText,
            } as HTMLAttributes<HTMLElement>
          }
        />
      )
    },
    testCase: (getComponent) => {
      test("All progress parts", async () => {
        await render(getComponent())
        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.valueText)).toBeVisible()
        await expect.element(page.getByTestId(testIds.track)).toBeVisible()
        await expect.element(page.getByTestId(testIds.bar)).toBeVisible()
        await expect.element(page.getByTestId(testIds.errorText)).toBeVisible()
      })
    },
  },
]

describe("Progress", () => {
  runTests(tests)
})
