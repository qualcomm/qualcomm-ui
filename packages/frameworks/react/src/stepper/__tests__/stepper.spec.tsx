import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Stepper, type StepperRootProps} from "@qualcomm-ui/react/stepper"

const hints = ["Configure", "Review", "Confirm"]

function TestStepper(props: Partial<StepperRootProps>) {
  const count = props.count ?? 3
  const labels = Array.from({length: count}, (_, i) => `Step ${i + 1}`)

  return (
    <Stepper.Root {...props} count={count}>
      <Stepper.List>
        {labels.map((label, index) => (
          <Stepper.Item key={index} index={index}>
            <Stepper.Trigger>
              <Stepper.Indicator />
              <Stepper.Label>{label}</Stepper.Label>
            </Stepper.Trigger>
            <Stepper.Hint>{hints[index]}</Stepper.Hint>
            <Stepper.Separator />
          </Stepper.Item>
        ))}
      </Stepper.List>

      {labels.map((_, index) => (
        <Stepper.Content key={index} index={index}>
          Content {index + 1}
        </Stepper.Content>
      ))}

      <Stepper.CompletedContent>All done!</Stepper.CompletedContent>

      <Stepper.PrevTrigger>
        {(props) => <button {...props}>Prev</button>}
      </Stepper.PrevTrigger>
      <Stepper.NextTrigger>
        {(props) => <button {...props}>Next</button>}
      </Stepper.NextTrigger>
    </Stepper.Root>
  )
}

function getStepTrigger(label: string) {
  return page.getByRole("tab", {name: label})
}

async function assertStepCurrent(label: string) {
  await expect
    .element(getStepTrigger(label))
    .toHaveAttribute("aria-current", "step")
}

async function assertContentVisible(text: string) {
  await expect.element(page.getByText(text)).toBeVisible()
}

async function assertContentNotVisible(text: string) {
  await expect.element(page.getByText(text)).not.toBeVisible()
}

describe("navigation", () => {
  test("first step is active by default", async () => {
    await render(<TestStepper />)

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("defaultStep sets initial active step", async () => {
    await render(<TestStepper defaultStep={1} />)

    await assertStepCurrent("Step 2")
    await assertContentVisible("Content 2")
    await assertContentNotVisible("Content 1")
  })

  test("clicking a trigger navigates to that step in non-linear mode", async () => {
    await render(<TestStepper linear={false} />)

    await getStepTrigger("Step 3").click()

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })

  test("next trigger advances to next step", async () => {
    await render(<TestStepper />)

    await page.getByRole("button", {name: "Next"}).click()

    await assertStepCurrent("Step 2")
    await assertContentVisible("Content 2")
  })

  test("prev trigger goes to previous step", async () => {
    await render(<TestStepper defaultStep={1} />)

    await page.getByRole("button", {name: "Prev"}).click()

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("prev trigger is disabled on first step", async () => {
    await render(<TestStepper />)

    await expect
      .element(page.getByRole("button", {name: "Prev"}))
      .toBeDisabled()
  })

  test("next trigger is disabled on last step", async () => {
    await render(<TestStepper defaultStep={2} />)

    await page.getByRole("button", {name: "Next"}).click()

    await expect
      .element(page.getByRole("button", {name: "Next"}))
      .toBeDisabled()
  })

  test("non-adjacent forward step triggers are not actionable in linear mode", async () => {
    await render(<TestStepper linear />)

    await expect
      .element(getStepTrigger("Step 3"))
      .toHaveAttribute("aria-disabled", "true")
    await assertStepCurrent("Step 1")
  })

  test("backward navigation is always allowed in linear mode", async () => {
    await render(<TestStepper defaultStep={2} linear />)

    await getStepTrigger("Step 1").click()

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("non-linear mode allows clicking any step", async () => {
    await render(<TestStepper linear={false} />)

    await getStepTrigger("Step 3").click()
    await assertStepCurrent("Step 3")

    await getStepTrigger("Step 1").click()
    await assertStepCurrent("Step 1")
  })

  test("controlled step prop determines active step", async () => {
    await render(<TestStepper step={2} />)

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })

  test("onStepChange fires with the new step index on navigation", async () => {
    const onStepChange = vi.fn()
    await render(<TestStepper onStepChange={onStepChange} step={0} />)

    await page.getByRole("button", {name: "Next"}).click()

    await expect.poll(() => onStepChange).toHaveBeenCalledWith(1)
  })

  test("resetStep via Context returns to step 0", async () => {
    await render(
      <Stepper.Root count={3} defaultStep={2}>
        <Stepper.List>
          {[0, 1, 2].map((index) => (
            <Stepper.Item key={index} index={index}>
              <Stepper.Trigger>
                <Stepper.Label>Step {index + 1}</Stepper.Label>
              </Stepper.Trigger>
              <Stepper.Separator />
            </Stepper.Item>
          ))}
        </Stepper.List>

        {[0, 1, 2].map((index) => (
          <Stepper.Content key={index} index={index}>
            Content {index + 1}
          </Stepper.Content>
        ))}

        <Stepper.Context>
          {(api) => (
            <button onClick={api.resetStep} type="button">
              Reset
            </button>
          )}
        </Stepper.Context>
      </Stepper.Root>,
    )

    await assertStepCurrent("Step 3")

    await page.getByRole("button", {name: "Reset"}).click()

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("setStep via Context jumps to a specific step", async () => {
    await render(
      <Stepper.Root count={3} linear={false}>
        <Stepper.List>
          {[0, 1, 2].map((index) => (
            <Stepper.Item key={index} index={index}>
              <Stepper.Trigger>
                <Stepper.Indicator />
                <Stepper.Label>Step {index + 1}</Stepper.Label>
              </Stepper.Trigger>
              <Stepper.Separator />
            </Stepper.Item>
          ))}
        </Stepper.List>

        {[0, 1, 2].map((index) => (
          <Stepper.Content key={index} index={index}>
            Content {index + 1}
          </Stepper.Content>
        ))}

        <Stepper.Context>
          {(api) => (
            <button onClick={() => api.setStep(2)} type="button">
              Jump to Step 3
            </button>
          )}
        </Stepper.Context>
      </Stepper.Root>,
    )

    await assertStepCurrent("Step 1")

    await page.getByRole("button", {name: "Jump to Step 3"}).click()

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })
})

describe("validation", () => {
  test("canGoToStep returning false blocks forward navigation", async () => {
    await render(<TestStepper canGoToStep={() => false} />)

    await page.getByRole("button", {name: "Next"}).click()

    await assertStepCurrent("Step 1")
  })

  test("canGoToStep returning true allows skipping steps", async () => {
    await render(<TestStepper canGoToStep={() => true} />)

    await getStepTrigger("Step 3").click()

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })

  test("canGoToStep returning undefined defers to default linear behavior", async () => {
    await render(<TestStepper canGoToStep={() => undefined} linear />)

    await page.getByRole("button", {name: "Next"}).click()
    await assertStepCurrent("Step 2")

    await expect
      .element(getStepTrigger("Step 1"))
      .not.toHaveAttribute("aria-disabled")
  })

  test("canGoToStep receives correct details object", async () => {
    const canGoToStep = vi.fn(() => true)
    await render(<TestStepper canGoToStep={canGoToStep} />)

    await getStepTrigger("Step 2").click()

    await expect
      .poll(() => canGoToStep)
      .toHaveBeenCalledWith({
        current: 0,
        target: 1,
        visited: false,
      })
  })

  test("onStepInvalid fires when navigation is blocked", async () => {
    const onStepInvalid = vi.fn()
    await render(
      <TestStepper canGoToStep={() => false} onStepInvalid={onStepInvalid} />,
    )

    await page.getByRole("button", {name: "Next"}).click()

    await expect
      .poll(() => onStepInvalid)
      .toHaveBeenCalledWith({
        action: "next",
        step: 0,
        targetStep: 1,
      })
  })

  test("skippable step bypasses validation in linear mode", async () => {
    await render(
      <TestStepper
        canGoToStep={() => false}
        isStepSkippable={(index) => index === 0}
        linear
      />,
    )

    await page.getByRole("button", {name: "Next"}).click()

    await assertStepCurrent("Step 2")
  })
})

describe("content", () => {
  test("only current step content is visible", async () => {
    await render(<TestStepper defaultStep={1} />)

    await assertContentVisible("Content 2")
    await assertContentNotVisible("Content 1")
    await assertContentNotVisible("Content 3")
  })

  test("completed content is hidden when not all steps are done", async () => {
    await render(<TestStepper />)

    await assertContentNotVisible("All done!")
  })

  test("completed content is visible when navigated past the last step", async () => {
    await render(<TestStepper defaultStep={2} />)

    await page.getByRole("button", {name: "Next"}).click()

    await assertContentVisible("All done!")
  })

  test("hints are rendered for each step", async () => {
    await render(<TestStepper />)

    for (const hint of hints) {
      await expect.element(page.getByText(hint)).toBeVisible()
    }
  })
})
