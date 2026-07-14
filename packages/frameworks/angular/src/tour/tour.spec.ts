import {DOCUMENT} from "@angular/common"
import {Component, inject, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {afterEach, describe, expect, test, vi} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {TourModule, type TourStepDetails} from "@qualcomm-ui/angular/tour"
import type {
  TourStatusChangeDetails,
  TourStepChangeDetails,
  TourStepsChangeDetails,
  TourTranslations,
} from "@qualcomm-ui/core/tour"
import type {Direction} from "@qualcomm-ui/utils/direction"

const labels = {
  close: "close tour",
  finish: "Finish",
  firstDescription: "Learn about the first target",
  firstHeading: "First target",
  next: "Next",
  previous: "Previous",
  secondDescription: "Learn about the second target",
  secondHeading: "Second target",
  skip: "Skip",
  start: "Start tour",
  startSecond: "Start second step",
}

function createSteps(document: Document): TourStepDetails[] {
  return [
    {
      actions: [{action: "next", label: labels.next}],
      arrow: true,
      backdrop: true,
      description: labels.firstDescription,
      heading: labels.firstHeading,
      id: "first",
      target: () =>
        document.querySelector<HTMLElement>("#angular-tour-target-1"),
      type: "tooltip",
    },
    {
      actions: [
        {action: "prev", label: labels.previous},
        {action: "dismiss", label: labels.finish},
      ],
      description: labels.secondDescription,
      heading: labels.secondHeading,
      id: "second",
      target: () =>
        document.querySelector<HTMLElement>("#angular-tour-target-2"),
      type: "tooltip",
    },
  ]
}

let fixtureSetup: ((component: TourFixtureComponent) => void) | undefined

@Component({
  imports: [TourModule],
  template: `
    <div
      q-tour
      [closeOnEscape]="closeOnEscape()"
      [closeOnInteractOutside]="closeOnInteractOutside()"
      [dir]="dir()"
      [keyboardNavigation]="keyboardNavigation()"
      [preventInteraction]="preventInteraction()"
      [stepId]="stepId()"
      [steps]="steps()"
      [translations]="translations()"
      (statusChanged)="onStatusChange($event)"
      (stepChanged)="onStepChange($event)"
      (stepsChanged)="stepsChanges.push($event)"
    >
      <ng-container *tourContext="let tour">
        <button type="button" (click)="tour.start()">{{ labels.start }}</button>
        <button type="button" (click)="tour.start('second')">
          {{ labels.startSecond }}
        </button>
        <button type="button" (click)="tour.addStep(thirdStep)">Add step</button>
        <button
          type="button"
          (click)="tour.updateStep('third', {heading: 'Updated third heading'})"
        >
          Update step
        </button>
        <button type="button" (click)="tour.start('third')">Start third</button>
        <button type="button" (click)="tour.removeStep('third')">Remove step</button>
        <button type="button" (click)="tour.setSteps(resetSteps)">Reset steps</button>
      </ng-container>
      <button type="button">Outside control</button>
      <button type="button" (click)="delayedTargetVisible.set(true)">
        Add delayed target
      </button>
      <div id="angular-tour-target-1">Target 1</div>
      <div id="angular-tour-target-2">Target 2</div>
      @if (delayedTargetVisible()) {
        <div id="angular-delayed-target">Delayed target</div>
      }
    </div>
  `,
})
class TourFixtureComponent {
  readonly closeOnEscape = signal(true)
  readonly closeOnInteractOutside = signal(true)
  readonly dir = signal<Direction>("ltr")
  readonly delayedTargetVisible = signal(false)
  readonly keyboardNavigation = signal(true)
  readonly labels = labels
  readonly preventInteraction = signal(false)
  readonly document = inject(DOCUMENT)
  readonly resetSteps = createSteps(this.document)
  readonly statuses: TourStatusChangeDetails[] = []
  readonly stepChanges: TourStepChangeDetails[] = []
  readonly stepId = signal<string | null | undefined>(undefined)
  readonly steps = signal<TourStepDetails[]>(createSteps(this.document))
  readonly stepsChanges: TourStepsChangeDetails[] = []
  readonly thirdStep: TourStepDetails = {
    description: "Third description",
    heading: "Third heading",
    id: "third",
    type: "dialog",
  }
  readonly translations = signal<Partial<TourTranslations> | undefined>(
    undefined,
  )

  constructor() {
    fixtureSetup?.(this)
  }

  onStatusChange(details: TourStatusChangeDetails) {
    this.statuses.push(details)
  }

  onStepChange(details: TourStepChangeDetails) {
    this.stepChanges.push(details)
    if (this.stepId() !== undefined) {
      this.stepId.set(details.stepId)
    }
  }
}

@Component({
  imports: [PortalDirective, TourModule],
  template: `
    <div q-tour-root [preventInteraction]="true" [steps]="steps">
      <ng-container *tourContext="let tour">
        <button type="button" (click)="tour.start()">{{ labels.start }}</button>
        @if (tour.open && tour.step) {
          <ng-template qPortal>
            @if (tour.step.backdrop) {
              <div data-test-id="tour-backdrop" q-tour-backdrop></div>
            }
            <div data-test-id="tour-spotlight" q-tour-spotlight></div>
            <div data-test-id="tour-positioner" q-tour-positioner>
              <section q-tour-content>
                @if (tour.step.arrow) {
                  <div data-test-id="tour-arrow" q-tour-arrow>
                    <div q-tour-arrow-tip></div>
                  </div>
                }
                <h2 q-tour-heading>{{ tour.step.heading }}</h2>
                <div q-tour-description>{{ tour.step.description }}</div>
                <div q-tour-progress-text>{{ tour.getProgressText() }}</div>
                @for (action of tour.step.actions ?? []; track action.label) {
                  <button q-tour-action-trigger [action]="action">
                    {{ action.label }}
                  </button>
                }
                <button q-tour-close-button></button>
              </section>
            </div>
          </ng-template>
        }
      </ng-container>
      <button id="angular-tour-target-1" type="button">Target 1</button>
      <div id="angular-tour-target-2">Target 2</div>
    </div>
  `,
})
class CompoundTourFixtureComponent {
  private readonly document = inject(DOCUMENT)
  readonly labels = labels
  readonly steps = createSteps(this.document)
}

@Component({
  imports: [TourModule],
  selector: "test-invalid-tour",
  template: `
    <div q-tour [steps]="steps"></div>
  `,
})
class InvalidTourComponent {
  private readonly document = inject(DOCUMENT)
  readonly steps = [
    createSteps(this.document)[0],
    createSteps(this.document)[0],
  ]
}

@Component({
  imports: [TourModule],
  selector: "test-missing-route-tour",
  template: `
    <div q-tour [steps]="steps"></div>
  `,
})
class MissingRouteTourComponent {
  readonly steps: TourStepDetails[] = [
    {
      description: "Invalid description",
      heading: "Invalid heading",
      id: "invalid",
    },
  ]
}

function currentDialog() {
  return page.getByRole("alertdialog")
}

function currentHeading(name: string) {
  return page.getByRole("heading", {name})
}

async function renderFixture(
  setup?: (component: TourFixtureComponent) => void,
) {
  fixtureSetup = setup
  try {
    return await render(TourFixtureComponent)
  } finally {
    fixtureSetup = undefined
  }
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe("Tour", () => {
  test.each([
    ["convenience", TourFixtureComponent],
    ["compound", CompoundTourFixtureComponent],
  ])("%s API starts and renders an accessible step", async (_, component) => {
    await render(component)

    await page.getByRole("button", {name: labels.start}).click()

    await expect.element(currentDialog()).toBeVisible()
    await expect
      .element(currentDialog())
      .toHaveAccessibleName(labels.firstHeading)
    await expect
      .element(currentDialog())
      .toHaveAccessibleDescription(labels.firstDescription)
    await expect.element(page.getByText("1 of 2")).toBeVisible()
  })

  test("start(id), next, previous, dismiss, and skip route steps", async () => {
    const result = await renderFixture((fixture) => {
      const steps = createSteps(fixture.document)
      steps[0] = {
        ...steps[0],
        actions: [
          ...(steps[0].actions ?? []),
          {action: "skip", label: labels.skip},
        ],
        backdrop: false,
      }
      fixture.steps.set(steps)
    })
    const component = result.fixture.componentInstance

    await page.getByRole("button", {name: labels.startSecond}).click()
    await expect.element(currentHeading(labels.secondHeading)).toBeVisible()
    await page.getByRole("button", {name: labels.previous}).click()
    await expect.element(currentHeading(labels.firstHeading)).toBeVisible()
    await page.getByRole("button", {name: labels.next}).click()
    await page.getByText(labels.finish).click()

    expect(component.statuses.map(({status}) => status)).toEqual([
      "started",
      "dismissed",
      "completed",
    ])

    await page.getByRole("button", {name: labels.start}).click()
    await page.getByText(labels.skip).click()
    expect(component.statuses.at(-1)?.status).toBe("skipped")
  })

  test("standard and custom actions expose state and the action map", async () => {
    const customAction = vi.fn(
      (
        actions: Parameters<
          Exclude<TourStepDetails["actions"], undefined>[number]["action"]
        >[0],
      ) => actions.goto("second"),
    )
    await renderFixture((component) => {
      const steps = createSteps(component.document)
      steps[0] = {
        ...steps[0],
        actions: [
          {action: "prev", label: labels.previous},
          {action: customAction, label: "Go to second"},
        ],
        backdrop: false,
      }
      component.steps.set(steps)
    })
    await page.getByRole("button", {name: labels.start}).click()

    await expect
      .element(page.getByRole("button", {name: labels.previous}))
      .toBeDisabled()
    await page.getByRole("button", {name: "Go to second"}).click()

    expect(customAction).toHaveBeenCalledOnce()
    expect(customAction.mock.calls[0][0]).toEqual({
      dismiss: expect.any(Function),
      goto: expect.any(Function),
      next: expect.any(Function),
      prev: expect.any(Function),
      skip: expect.any(Function),
    })
    await expect.element(currentHeading(labels.secondHeading)).toBeVisible()
  })

  test("controlled stepId and lifecycle outputs stay synchronized", async () => {
    const result = await renderFixture((component) => {
      const steps = createSteps(component.document)
      steps[0] = {...steps[0], backdrop: false}
      component.steps.set(steps)
    })
    const component = result.fixture.componentInstance

    await page.getByRole("button", {name: labels.start}).click()
    await expect.element(currentHeading(labels.firstHeading)).toBeVisible()
    component.stepId.set("first")
    result.fixture.detectChanges()
    await page.getByRole("button", {name: labels.next}).click()

    expect(component.stepId()).toBe("second")
    expect(component.stepChanges.at(-1)).toEqual({
      complete: true,
      progress: 1,
      stepId: "second",
      stepIndex: 1,
      totalSteps: 2,
    })
  })

  test("setSteps, addStep, updateStep, and removeStep update public state", async () => {
    const result = await renderFixture()
    const component = result.fixture.componentInstance

    await page.getByRole("button", {name: "Add step"}).click()
    await expect.poll(() => component.stepsChanges.length).toBe(1)
    await page.getByRole("button", {name: "Update step"}).click()
    await expect.poll(() => component.stepsChanges.length).toBe(2)
    expect(
      component.stepsChanges[1].steps.find(({id}) => id === "third")?.heading,
    ).toBe("Updated third heading")
    await page.getByRole("button", {name: "Remove step"}).click()
    await expect.poll(() => component.stepsChanges.length).toBe(3)
    expect(component.stepsChanges[2].steps.some(({id}) => id === "third")).toBe(
      false,
    )
    await page.getByRole("button", {name: "Reset steps"}).click()

    await expect.poll(() => component.stepsChanges.length).toBe(4)
  })

  test.each(["dialog", "floating"] as const)(
    "targetless %s steps render",
    async (type) => {
      await renderFixture((component) =>
        component.steps.set([
          {
            description: `${type} description`,
            heading: `${type} heading`,
            id: type,
            type,
          },
        ]),
      )
      await page.getByRole("button", {name: labels.start}).click()

      await expect.element(currentHeading(`${type} heading`)).toBeVisible()
      await expect
        .element(currentDialog())
        .toHaveAccessibleDescription(`${type} description`)
    },
  )

  test("effects update, show, navigate, dismiss, and clean up", async () => {
    const cleanup = vi.fn()
    await renderFixture((component) =>
      component.steps.set([
        {
          description: "Effect description",
          effect({dismiss, show, update}) {
            update({heading: "Updated effect heading"})
            show()
            queueMicrotask(dismiss)
            return cleanup
          },
          heading: "Effect heading",
          id: "effect",
          type: "dialog",
        },
      ]),
    )
    await page.getByRole("button", {name: labels.start}).click()

    await expect.element(currentDialog()).not.toBeInTheDocument()
    await vi.waitFor(() => expect(cleanup).toHaveBeenCalledOnce())
  })

  test("wait steps navigate without opening", async () => {
    await renderFixture((component) =>
      component.steps.set([
        {
          description: "Waiting",
          effect({next}) {
            queueMicrotask(next)
          },
          heading: "Wait",
          id: "wait",
          type: "wait",
        },
        {
          description: "Ready description",
          heading: "Ready heading",
          id: "ready",
          type: "dialog",
        },
      ]),
    )
    await page.getByRole("button", {name: labels.start}).click()

    await expect.element(currentHeading("Ready heading")).toBeVisible()
  })

  test("a target added later opens the pending step", async () => {
    await renderFixture((component) =>
      component.steps.set([
        {
          description: "Delayed description",
          heading: "Delayed heading",
          id: "delayed",
          target: () =>
            component.document.querySelector<HTMLElement>(
              "#angular-delayed-target",
            ),
          type: "tooltip",
        },
      ]),
    )
    await page.getByRole("button", {name: labels.start}).click()
    await expect.element(currentDialog()).not.toBeInTheDocument()

    await page.getByRole("button", {name: "Add delayed target"}).click()

    await expect.element(currentHeading("Delayed heading")).toBeVisible()
  })

  test("a missing target reports not-found", async () => {
    const result = await renderFixture((component) =>
      component.steps.set([
        {
          description: "Missing description",
          heading: "Missing heading",
          id: "missing",
          target: () => null,
          type: "tooltip",
        },
      ]),
    )
    await page.getByRole("button", {name: labels.start}).click()
    await expect
      .poll(() => result.fixture.componentInstance.statuses.at(-1)?.status, {
        timeout: 4_000,
      })
      .toBe("not-found")
  }, 5_000)

  test.each([
    [true, false],
    [false, true],
  ])("closeOnEscape=%s controls dismissal", async (closeOnEscape, visible) => {
    await renderFixture((component) =>
      component.closeOnEscape.set(closeOnEscape),
    )
    await page.getByRole("button", {name: labels.start}).click()
    await userEvent.keyboard("{Escape}")

    if (visible) {
      await expect.element(currentDialog()).toBeVisible()
    } else {
      await expect.element(currentDialog()).not.toBeInTheDocument()
    }
  })

  test.each([
    [true, false],
    [false, true],
  ])(
    "closeOnInteractOutside=%s controls dismissal",
    async (closeOnInteractOutside, visible) => {
      await renderFixture((component) => {
        component.closeOnInteractOutside.set(closeOnInteractOutside)
        const steps = createSteps(component.document)
        steps[0] = {...steps[0], backdrop: false}
        component.steps.set(steps)
      })
      await page.getByRole("button", {name: labels.start}).click()
      await page.getByRole("button", {name: "Outside control"}).click()

      if (visible) {
        await expect.element(currentDialog()).toBeVisible()
      } else {
        await expect.element(currentDialog()).not.toBeInTheDocument()
      }
    },
  )

  test.each([
    ["ltr", "{ArrowRight}"],
    ["rtl", "{ArrowLeft}"],
  ] as const)("%s keyboard navigation follows direction", async (dir, key) => {
    await renderFixture((component) => component.dir.set(dir))
    await page.getByRole("button", {name: labels.start}).click()
    await currentDialog().click()
    await userEvent.keyboard(key)

    await expect.element(currentHeading(labels.secondHeading)).toBeVisible()
  })

  test("keyboardNavigation=false disables arrow navigation", async () => {
    await renderFixture((component) => component.keyboardNavigation.set(false))
    await page.getByRole("button", {name: labels.start}).click()
    await currentDialog().click()
    await userEvent.keyboard("{ArrowRight}")

    await expect.element(currentHeading(labels.firstHeading)).toBeVisible()
  })

  test("compound overlays render and follow the real target", async () => {
    const result = await render(CompoundTourFixtureComponent)
    await page.getByRole("button", {name: labels.start}).click()

    const target = page.getByRole("button", {name: "Target 1"})
    const targetElement = target.element() as HTMLElement
    const dialog = currentDialog()
    await expect.element(page.getByTestId("tour-backdrop")).toBeVisible()
    await expect.element(page.getByTestId("tour-spotlight")).toBeVisible()
    await expect.element(page.getByTestId("tour-arrow")).toBeVisible()
    await expect
      .poll(() => {
        const targetBox = targetElement.getBoundingClientRect()
        const dialogBox = dialog.element().getBoundingClientRect()
        return targetBox.bottom < dialogBox.bottom
      })
      .toBe(true)
    expect(targetElement.inert).toBe(true)

    result.fixture.destroy()
    expect(targetElement.inert).toBe(false)
  })

  test("translations control progress and accessible action labels", async () => {
    await renderFixture((component) => {
      const steps = createSteps(component.document)
      steps[0] = {
        ...steps[0],
        actions: [{action: "next", label: "Continue"}],
      }
      component.steps.set(steps)
      component.translations.set({
        nextStep: "Go forward",
        progressText: ({current, total}) => `Step ${current + 1} / ${total}`,
      })
    })
    await page.getByRole("button", {name: labels.start}).click()

    await expect.element(page.getByText("Step 1 / 2")).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Go forward"}))
      .toHaveTextContent("Continue")
  })

  test("duplicate IDs reject async render", async () => {
    await expect(render(InvalidTourComponent)).rejects.toThrow(
      "[@qualcomm-ui/core/tour] Duplicate step id: first",
    )
  })

  test("missing target/type rejects async render", async () => {
    await expect(render(MissingRouteTourComponent)).rejects.toThrow(
      "[@qualcomm-ui/core/tour] Step invalid has no target or type",
    )
  })
})
