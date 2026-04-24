import {Component, output} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test, vi} from "vitest"
import {page} from "vitest/browser"

import {StepperModule} from "@qualcomm-ui/angular/stepper"
import type {
  CanGoToStepDetails,
  StepInvalidDetails,
} from "@qualcomm-ui/core/stepper"

const labels = ["Step 1", "Step 2", "Step 3"]
const hints = ["Configure", "Review", "Confirm"]

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
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <div q-stepper-indicator>{{ i + 1 }}</div>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("defaultStep sets initial active step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [defaultStep]="1">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <div q-stepper-indicator>{{ i + 1 }}</div>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await assertStepCurrent("Step 2")
    await assertContentVisible("Content 2")
    await assertContentNotVisible("Content 1")
  })

  test("clicking a trigger navigates to that step in non-linear mode", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [linear]="false">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <div q-stepper-indicator>{{ i + 1 }}</div>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await getStepTrigger("Step 3").click()

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })

  test("next trigger advances to next step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <div q-stepper-indicator>{{ i + 1 }}</div>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Next"}).click()

    await assertStepCurrent("Step 2")
    await assertContentVisible("Content 2")
  })

  test("prev trigger goes to previous step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [defaultStep]="1">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <div q-stepper-indicator>{{ i + 1 }}</div>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Prev"}).click()

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("prev trigger is disabled on first step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await expect
      .element(page.getByRole("button", {name: "Prev"}))
      .toBeDisabled()
  })

  test("next trigger is disabled on last step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [defaultStep]="2">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Next"}).click()

    await expect
      .element(page.getByRole("button", {name: "Next"}))
      .toBeDisabled()
  })

  test("non-adjacent forward step triggers are not actionable in linear mode", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div linear q-stepper-root [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await expect
      .element(getStepTrigger("Step 3"))
      .toHaveAttribute("aria-disabled", "true")
    await assertStepCurrent("Step 1")
  })

  test("backward navigation is always allowed in linear mode", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div linear q-stepper-root [count]="3" [defaultStep]="2">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await getStepTrigger("Step 1").click()

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("non-linear mode allows clicking any step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [linear]="false">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await getStepTrigger("Step 3").click()
    await assertStepCurrent("Step 3")

    await getStepTrigger("Step 1").click()
    await assertStepCurrent("Step 1")
  })

  test("controlled step prop determines active step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [step]="2">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })

  test("stepChanged fires with the new step index on navigation", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div
          q-stepper-root
          [count]="3"
          [step]="0"
          (stepChanged)="stepChanged.emit($event)"
        >
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly stepChanged = output<number>()
    }

    const stepChangedSpy = vi.fn()
    await render(TestComponent, {
      on: {stepChanged: (value) => stepChangedSpy(value)},
    })

    await page.getByRole("button", {name: "Next"}).click()

    await expect.poll(() => stepChangedSpy).toHaveBeenCalledWith(1)
  })

  test("resetStep via context returns to step 0", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [defaultStep]="2">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
          <ng-container *stepperContext="let api">
            <button (click)="api.resetStep()">Reset</button>
          </ng-container>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await assertStepCurrent("Step 3")

    await page.getByRole("button", {name: "Reset"}).click()

    await assertStepCurrent("Step 1")
    await assertContentVisible("Content 1")
  })

  test("setStep via context jumps to a specific step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [linear]="false">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <div q-stepper-indicator>{{ i + 1 }}</div>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
          <ng-container *stepperContext="let api">
            <button (click)="api.setStep(2)">Jump to Step 3</button>
          </ng-container>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await assertStepCurrent("Step 1")

    await page.getByRole("button", {name: "Jump to Step 3"}).click()

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })
})

describe("validation", () => {
  test("canGoToStep returning false blocks forward navigation", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [canGoToStep]="canGoToStep" [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly canGoToStep = () => false
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Next"}).click()

    await assertStepCurrent("Step 1")
  })

  test("canGoToStep returning true allows skipping steps", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [canGoToStep]="canGoToStep" [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly canGoToStep = () => true
    }

    await render(TestComponent)

    await getStepTrigger("Step 3").click()

    await assertStepCurrent("Step 3")
    await assertContentVisible("Content 3")
  })

  test("canGoToStep returning undefined defers to default linear behavior", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div linear q-stepper-root [canGoToStep]="canGoToStep" [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly canGoToStep = () => undefined
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Next"}).click()
    await assertStepCurrent("Step 2")

    await expect
      .element(getStepTrigger("Step 1"))
      .not.toHaveAttribute("aria-disabled")
  })

  test("canGoToStep receives correct details object", async () => {
    const canGoToStep = vi.fn(
      (_details: CanGoToStepDetails): boolean | undefined => true,
    )

    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [canGoToStep]="canGoToStep" [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly canGoToStep = canGoToStep
    }

    await render(TestComponent)

    await getStepTrigger("Step 2").click()

    await expect
      .poll(() => canGoToStep)
      .toHaveBeenCalledWith({
        current: 0,
        target: 1,
        visited: false,
      })
  })

  test("stepInvalid fires when navigation is blocked", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div
          q-stepper-root
          [canGoToStep]="canGoToStep"
          [count]="3"
          (stepInvalid)="stepInvalid.emit($event)"
        >
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly canGoToStep = () => false
      readonly stepInvalid = output<StepInvalidDetails>()
    }

    const stepInvalidSpy = vi.fn()
    await render(TestComponent, {
      on: {stepInvalid: (details) => stepInvalidSpy(details)},
    })

    await page.getByRole("button", {name: "Next"}).click()

    await expect
      .poll(() => stepInvalidSpy)
      .toHaveBeenCalledWith({
        action: "next",
        step: 0,
        targetStep: 1,
      })
  })

  test("skippable step bypasses validation in linear mode", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div
          linear
          q-stepper-root
          [canGoToStep]="canGoToStep"
          [count]="3"
          [isStepSkippable]="isStepSkippable"
        >
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly canGoToStep = () => false
      readonly isStepSkippable = (index: number) => index === 0
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Next"}).click()

    await assertStepCurrent("Step 2")
  })
})

describe("content", () => {
  test("only current step content is visible", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [defaultStep]="1">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          @for (label of labels; track label; let i = $index) {
            <div q-stepper-content [index]="i">Content {{ i + 1 }}</div>
          }
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await assertContentVisible("Content 2")
    await assertContentNotVisible("Content 1")
    await assertContentNotVisible("Content 3")
  })

  test("completed content is hidden when not all steps are done", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <div q-stepper-completed-content>All done!</div>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await assertContentNotVisible("All done!")
  })

  test("completed content is visible when navigated past the last step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3" [defaultStep]="2">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
          <div q-stepper-completed-content>All done!</div>
          <button q-stepper-prev-trigger>Prev</button>
          <button q-stepper-next-trigger>Next</button>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
    }

    await render(TestComponent)

    await page.getByRole("button", {name: "Next"}).click()

    await assertContentVisible("All done!")
  })

  test("hints are rendered for each step", async () => {
    @Component({
      imports: [StepperModule],
      template: `
        <div q-stepper-root [count]="3">
          <div q-stepper-list>
            @for (label of labels; track label; let i = $index) {
              <div q-stepper-item [index]="i">
                <button q-stepper-trigger>
                  <span q-stepper-label>{{ label }}</span>
                </button>
                <span q-stepper-hint>{{ hints[i] }}</span>
                <div q-stepper-separator></div>
              </div>
            }
          </div>
        </div>
      `,
    })
    class TestComponent {
      readonly labels = labels
      readonly hints = hints
    }

    await render(TestComponent)

    for (const hint of hints) {
      await expect.element(page.getByText(hint)).toBeVisible()
    }
  })
})
