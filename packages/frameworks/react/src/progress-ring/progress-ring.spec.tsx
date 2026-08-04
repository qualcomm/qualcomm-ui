import {type HTMLAttributes, type SVGAttributes, useState} from "react"

import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {ProgressRing} from "@qualcomm-ui/react/progress-ring"

import {type MultiComponentTestCase, runTests} from "~test-utils/runner"

const testLabel = "Test Progress Ring"
const errorMessage = "Error occurred"

const testIds = {
  bar: "progress-ring-bar",
  circle: "progress-ring-circle",
  circleContainer: "progress-ring-circle-container",
  errorText: "progress-ring-error-text",
  label: "progress-ring-label",
  root: "progress-ring-root",
  track: "progress-ring-track",
  valueText: "progress-ring-value-text",
}

const tests: MultiComponentTestCase[] = [
  {
    composite() {
      return (
        <ProgressRing.Root>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing label={testLabel} />
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
        <ProgressRing.Root value={50}>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing label={testLabel} value={50} />
    },
    testCase: (getComponent) => {
      test("Progress ring with value", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).toHaveAttribute("aria-valuenow", "50")
        await expect.element(progressbar).toHaveAttribute("aria-valuemin", "0")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuemax", "100")
      })
    },
  },
  {
    composite() {
      return (
        <ProgressRing.Root value={100}>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing label={testLabel} value={100} />
    },
    testCase: (getComponent) => {
      test("Complete progress ring", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuenow", "100")
      })
    },
  },
  {
    composite() {
      return (
        <ProgressRing.Root value={null}>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing label={testLabel} value={null} />
    },
    testCase: (getComponent) => {
      test("Indeterminate progress ring", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect.element(progressbar).not.toHaveAttribute("aria-valuenow")
      })
    },
  },
  {
    composite() {
      return (
        <ProgressRing.Root max={200} min={10} value={100}>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing label={testLabel} max={200} min={10} value={100} />
    },
    testCase: (getComponent) => {
      test("Custom min/max values", async () => {
        await render(getComponent())
        const progressbar = page.getByRole("progressbar")
        await expect
          .element(progressbar)
          .toHaveAttribute("aria-valuenow", "100")
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
        <ProgressRing.Root>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing label={testLabel} />
    },
    testCase: (getComponent) => {
      test("Label renders", async () => {
        await render(getComponent())
        await expect.element(page.getByText(testLabel)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <ProgressRing.Root size="lg" value={50}>
          <ProgressRing.CircleContainer>
            <ProgressRing.Context>
              {(api) => (
                <ProgressRing.ValueText>
                  {api.valuePercent}%
                </ProgressRing.ValueText>
              )}
            </ProgressRing.Context>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return (
        <ProgressRing
          label={testLabel}
          size="lg"
          value={50}
          valueText={(api) => `${api.valuePercent}%`}
        />
      )
    },
    testCase: (getComponent) => {
      test("Value text renders", async () => {
        await render(getComponent())
        await expect.element(page.getByText("50%")).toBeVisible()
      })
    },
  },
  {
    composite() {
      function Component() {
        const [value, setValue] = useState<number | null | undefined>(25)
        return (
          <div>
            <ProgressRing.Root onValueChange={setValue} value={value}>
              <ProgressRing.CircleContainer>
                <ProgressRing.Circle>
                  <ProgressRing.Track />
                  <ProgressRing.Bar />
                </ProgressRing.Circle>
              </ProgressRing.CircleContainer>
              <ProgressRing.Label>{testLabel}</ProgressRing.Label>
            </ProgressRing.Root>
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
        const [value, setValue] = useState<number | null | undefined>(25)
        return (
          <div>
            <ProgressRing
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
      test("Controlled value updates aria-valuenow", async () => {
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
        <ProgressRing.Root defaultValue={30}>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing defaultValue={30} label={testLabel} />
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
        <ProgressRing.Root invalid>
          <ProgressRing.CircleContainer>
            <ProgressRing.Circle>
              <ProgressRing.Track />
              <ProgressRing.Bar />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label>{testLabel}</ProgressRing.Label>
          <ProgressRing.ErrorText>{errorMessage}</ProgressRing.ErrorText>
        </ProgressRing.Root>
      )
    },
    simple() {
      return <ProgressRing errorText={errorMessage} invalid label={testLabel} />
    },
    testCase: (getComponent) => {
      test("Invalid progress ring with error text", async () => {
        await render(getComponent())
        await expect.element(page.getByText(errorMessage)).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <ProgressRing.Root
          data-test-id={testIds.root}
          invalid
          size="lg"
          value={60}
        >
          <ProgressRing.CircleContainer data-test-id={testIds.circleContainer}>
            <ProgressRing.Context>
              {() => (
                <ProgressRing.ValueText data-test-id={testIds.valueText}>
                  60%
                </ProgressRing.ValueText>
              )}
            </ProgressRing.Context>
            <ProgressRing.Circle data-test-id={testIds.circle}>
              <ProgressRing.Track data-test-id={testIds.track} />
              <ProgressRing.Bar data-test-id={testIds.bar} />
            </ProgressRing.Circle>
          </ProgressRing.CircleContainer>
          <ProgressRing.Label data-test-id={testIds.label}>
            {testLabel}
          </ProgressRing.Label>
          <ProgressRing.ErrorText data-test-id={testIds.errorText}>
            {errorMessage}
          </ProgressRing.ErrorText>
        </ProgressRing.Root>
      )
    },
    simple() {
      return (
        <ProgressRing
          barProps={
            {
              "data-test-id": testIds.bar,
            } as SVGAttributes<SVGCircleElement>
          }
          circleContainerProps={
            {
              "data-test-id": testIds.circleContainer,
            } as HTMLAttributes<HTMLElement>
          }
          circleProps={
            {
              "data-test-id": testIds.circle,
            } as SVGAttributes<SVGSVGElement>
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
          size="lg"
          trackProps={
            {
              "data-test-id": testIds.track,
            } as SVGAttributes<SVGCircleElement>
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
      test("All progress ring parts", async () => {
        await render(getComponent())
        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.circleContainer))
          .toBeVisible()
        await expect.element(page.getByTestId(testIds.label)).toBeVisible()
        await expect.element(page.getByTestId(testIds.valueText)).toBeVisible()
        await expect.element(page.getByTestId(testIds.circle)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.track))
          .toBeInTheDocument()
        await expect.element(page.getByTestId(testIds.bar)).toBeInTheDocument()
        await expect.element(page.getByTestId(testIds.errorText)).toBeVisible()
      })
    },
  },
]

describe("ProgressRing", () => {
  runTests(tests)
})
