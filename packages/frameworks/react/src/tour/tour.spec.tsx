import {type ReactElement, useState} from "react"

import {afterEach, describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {
  Tour,
  type TourApi,
  type TourFloatingPortalProps,
  type TourRootProps,
  type TourStatusChangeDetails,
  type TourStepDetails,
} from "@qualcomm-ui/react/tour"

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

function createSteps(): TourStepDetails[] {
  return [
    {
      actions: [{action: "next", label: labels.next}],
      arrow: true,
      backdrop: true,
      description: labels.firstDescription,
      heading: labels.firstHeading,
      id: "first",
      target: () => document.querySelector<HTMLElement>("#tour-target-1"),
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
      target: () => document.querySelector<HTMLElement>("#tour-target-2"),
      type: "tooltip",
    },
  ]
}

interface FixtureProps extends Partial<TourRootProps> {
  compound?: boolean
  exposeApi?: (api: TourApi) => void
  steps?: TourStepDetails[]
}

function StartControls({exposeApi}: Pick<FixtureProps, "exposeApi">) {
  return (
    <Tour.Context>
      {(tour) => {
        exposeApi?.(tour)
        return (
          <>
            <button onClick={() => tour.start()} type="button">
              {labels.start}
            </button>
            <button onClick={() => tour.start("second")} type="button">
              {labels.startSecond}
            </button>
          </>
        )
      }}
    </Tour.Context>
  )
}

function CompoundContent() {
  return (
    <Tour.Context>
      {(tour) => (
        <>
          <Tour.Heading>{tour.step?.heading}</Tour.Heading>
          <Tour.Description>{tour.step?.description}</Tour.Description>
          <Tour.ProgressText>{tour.getProgressText()}</Tour.ProgressText>
          <div>
            {tour.step?.actions?.map((action) => (
              <Tour.ActionTrigger key={action.label} action={action}>
                {action.label}
              </Tour.ActionTrigger>
            ))}
          </div>
          <Tour.CloseButton />
        </>
      )}
    </Tour.Context>
  )
}

function TourFixture({
  compound = false,
  exposeApi,
  steps = createSteps(),
  ...props
}: FixtureProps): ReactElement {
  const children = (
    <>
      <StartControls exposeApi={exposeApi} />
      <button type="button">Outside control</button>
      <div id="tour-target-1">Target 1</div>
      <div id="tour-target-2">Target 2</div>
    </>
  )

  if (compound) {
    return (
      <Tour.Root steps={steps} {...props}>
        {children}
        <Tour.FloatingPortal>
          <CompoundContent />
        </Tour.FloatingPortal>
      </Tour.Root>
    )
  }

  return (
    <Tour steps={steps} {...props}>
      {children}
    </Tour>
  )
}

function currentDialog() {
  return page.getByRole("alertdialog")
}

function currentHeading(name: string) {
  return page.getByRole("heading", {name})
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("Tour", () => {
  test.each([
    ["convenience", false],
    ["compound", true],
  ])(
    "%s API starts and renders an accessible first step",
    async (_, compound) => {
      await render(<TourFixture compound={compound} />)

      await expect.element(currentDialog()).not.toBeInTheDocument()
      await page.getByRole("button", {name: labels.start}).click()

      await expect.element(currentDialog()).toBeVisible()
      await expect
        .element(currentDialog())
        .toHaveAccessibleName(labels.firstHeading)
      await expect
        .element(currentDialog())
        .toHaveAccessibleDescription(labels.firstDescription)
      await expect.element(page.getByText("1 of 2")).toBeVisible()
    },
  )

  test("start(id) opens the requested step", async () => {
    await render(<TourFixture />)

    await page.getByRole("button", {name: labels.startSecond}).click()

    await expect.element(currentHeading(labels.secondHeading)).toBeVisible()
    await expect.element(page.getByText("2 of 2")).toBeVisible()
  })

  test("next and previous actions navigate", async () => {
    await render(<TourFixture />)
    await page.getByRole("button", {name: labels.start}).click()

    await page.getByRole("button", {name: labels.next}).click()
    await expect.element(currentHeading(labels.secondHeading)).toBeVisible()

    await page.getByRole("button", {name: labels.previous}).click()
    await expect.element(currentHeading(labels.firstHeading)).toBeVisible()
  })

  test("standard action disabled states reflect navigation availability", async () => {
    const steps: TourStepDetails[] = [
      {
        actions: [
          {action: "prev", label: labels.previous},
          {action: "next", label: labels.next},
        ],
        description: labels.firstDescription,
        heading: labels.firstHeading,
        id: "first",
        target: () => document.querySelector<HTMLElement>("#tour-target-1"),
        type: "tooltip",
      },
      {
        actions: [
          {action: "prev", label: labels.previous},
          {action: "next", label: labels.next},
        ],
        description: labels.secondDescription,
        heading: labels.secondHeading,
        id: "second",
        target: () => document.querySelector<HTMLElement>("#tour-target-2"),
        type: "tooltip",
      },
    ]
    await render(<TourFixture steps={steps} />)
    await page.getByRole("button", {name: labels.start}).click()

    await expect
      .element(page.getByRole("button", {name: labels.previous}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: labels.next}))
      .not.toBeDisabled()

    await page.getByRole("button", {name: labels.next}).click()
    await expect
      .element(page.getByRole("button", {name: labels.next}))
      .toBeDisabled()
    await expect
      .element(page.getByRole("button", {name: labels.previous}))
      .not.toBeDisabled()
  })

  test("custom actions receive the full action map", async () => {
    const customAction = vi.fn((actions) => actions.goto("second"))
    const steps = createSteps()
    steps[0] = {
      ...steps[0],
      actions: [{action: customAction, label: "Go to second"}],
    }
    await render(<TourFixture steps={steps} />)
    await page.getByRole("button", {name: labels.start}).click()

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

  test("dismiss, completion, and skip emit lifecycle status", async () => {
    const statuses: TourStatusChangeDetails[] = []
    const steps = createSteps()
    steps[0] = {
      ...steps[0],
      actions: [{action: "skip", label: labels.skip}],
    }
    const {unmount} = await render(
      <TourFixture
        onStatusChange={(details) => statuses.push(details)}
        steps={steps}
      />,
    )

    await page.getByRole("button", {name: labels.start}).click()
    await page.getByRole("button", {name: labels.skip}).click()
    expect(statuses.map(({status}) => status)).toEqual(["started", "skipped"])

    await unmount()
    statuses.length = 0
    await render(
      <TourFixture onStatusChange={(details) => statuses.push(details)} />,
    )
    await page.getByRole("button", {name: labels.startSecond}).click()
    await page.getByText(labels.finish).click()

    expect(statuses.map(({status}) => status)).toEqual([
      "started",
      "dismissed",
      "completed",
    ])
    await expect.element(currentDialog()).not.toBeInTheDocument()
  })

  test("controlled stepId and callbacks stay synchronized", async () => {
    const stepChanges = vi.fn()
    const steps = createSteps()
    steps[0] = {...steps[0], backdrop: false}

    function ControlledTour() {
      const [stepId, setStepId] = useState<string | null>(null)
      return (
        <TourFixture
          onStepChange={(details) => {
            stepChanges(details)
            setStepId(details.stepId)
          }}
          stepId={stepId}
          steps={steps}
        />
      )
    }

    await render(<ControlledTour />)
    await page.getByRole("button", {name: labels.start}).click()
    await page.getByRole("button", {name: labels.next}).click()

    await expect.element(currentHeading(labels.secondHeading)).toBeVisible()
    expect(stepChanges).toHaveBeenLastCalledWith({
      complete: true,
      progress: 1,
      stepId: "second",
      stepIndex: 1,
      totalSteps: 2,
    })
  })

  test("step mutation methods update public state", async () => {
    const stepsChanged = vi.fn()
    let api: TourApi | undefined
    await render(
      <TourFixture
        exposeApi={(value) => {
          api = value
        }}
        onStepsChange={stepsChanged}
      />,
    )

    expect(api).toBeDefined()
    api!.addStep({
      description: "Third description",
      heading: "Third heading",
      id: "third",
      type: "dialog",
    })
    await vi.waitFor(() => expect(api!.isValidStep("third")).toBe(true))
    api!.updateStep("third", {heading: "Updated third heading"})
    api!.start("third")
    await expect.element(currentHeading("Updated third heading")).toBeVisible()
    api!.removeStep("third")
    await vi.waitFor(() => expect(api!.isValidStep("third")).toBe(false))
    api!.setSteps(createSteps())

    await vi.waitFor(() => expect(stepsChanged).toHaveBeenCalledTimes(4))
  })

  test.each(["dialog", "floating"] as const)(
    "targetless %s steps render",
    async (type) => {
      const steps: TourStepDetails[] = [
        {
          description: `${type} description`,
          heading: `${type} heading`,
          id: type,
          type,
        },
      ]
      await render(<TourFixture steps={steps} />)
      await page.getByRole("button", {name: labels.start}).click()

      await expect.element(currentHeading(`${type} heading`)).toBeVisible()
      await expect
        .element(currentDialog())
        .toHaveAccessibleDescription(`${type} description`)
    },
  )

  test("step effects can update, show, and clean up", async () => {
    const cleanup = vi.fn()
    const steps: TourStepDetails[] = [
      {
        description: "Original description",
        effect({show, update}) {
          update({heading: "Updated effect heading"})
          show()
          return cleanup
        },
        heading: "Original effect heading",
        id: "effect",
        type: "dialog",
      },
    ]
    await render(<TourFixture steps={steps} />)
    await page.getByRole("button", {name: labels.start}).click()

    await expect.element(currentHeading("Updated effect heading")).toBeVisible()
    await page.getByRole("button", {name: labels.close}).click()
    expect(cleanup).toHaveBeenCalledOnce()
  })

  test("wait steps can navigate without opening", async () => {
    const steps: TourStepDetails[] = [
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
    ]
    await render(<TourFixture steps={steps} />)
    await page.getByRole("button", {name: labels.start}).click()

    await expect.element(currentHeading("Ready heading")).toBeVisible()
  })

  test("a target added later resolves before timeout", async () => {
    function DelayedTargetTour() {
      const [targetVisible, setTargetVisible] = useState(false)
      const steps: TourStepDetails[] = [
        {
          description: "Delayed description",
          heading: "Delayed heading",
          id: "delayed",
          target: () => document.querySelector<HTMLElement>("#delayed-target"),
          type: "tooltip",
        },
      ]
      return (
        <Tour steps={steps}>
          <Tour.Context>
            {(tour) => (
              <>
                <button onClick={() => tour.start()} type="button">
                  {labels.start}
                </button>
                <button onClick={() => setTargetVisible(true)} type="button">
                  Add target
                </button>
              </>
            )}
          </Tour.Context>
          {targetVisible ? <div id="delayed-target">Delayed target</div> : null}
        </Tour>
      )
    }
    await render(<DelayedTargetTour />)
    await page.getByRole("button", {name: labels.start}).click()
    await expect.element(currentDialog()).not.toBeInTheDocument()

    await page.getByRole("button", {name: "Add target"}).click()

    await expect.element(currentHeading("Delayed heading")).toBeVisible()
  })

  test("a missing target emits not-found", async () => {
    const statuses: TourStatusChangeDetails[] = []
    await render(
      <TourFixture
        onStatusChange={(details) => statuses.push(details)}
        steps={[
          {
            description: "Missing description",
            heading: "Missing heading",
            id: "missing",
            target: () => null,
            type: "tooltip",
          },
        ]}
      />,
    )
    await page.getByRole("button", {name: labels.start}).click()

    await vi.waitFor(
      () => {
        expect(statuses.at(-1)?.status).toBe("not-found")
      },
      {timeout: 4_000},
    )
    await expect.element(currentDialog()).not.toBeInTheDocument()
  }, 5_000)

  test.each([
    [true, false],
    [false, true],
  ])(
    "closeOnEscape=%s controls Escape dismissal",
    async (closeOnEscape, visible) => {
      await render(<TourFixture closeOnEscape={closeOnEscape} />)
      await page.getByRole("button", {name: labels.start}).click()
      await userEvent.keyboard("{Escape}")

      if (visible) {
        await expect.element(currentDialog()).toBeVisible()
      } else {
        await expect.element(currentDialog()).not.toBeInTheDocument()
      }
    },
  )

  test.each([
    [true, false],
    [false, true],
  ])(
    "closeOnInteractOutside=%s controls outside dismissal",
    async (closeOnInteractOutside, visible) => {
      const steps = createSteps()
      steps[0] = {...steps[0], backdrop: false}
      await render(
        <TourFixture
          closeOnInteractOutside={closeOnInteractOutside}
          steps={steps}
        />,
      )
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
    ["ltr", "{ArrowRight}", labels.secondHeading],
    ["rtl", "{ArrowLeft}", labels.secondHeading],
  ] as const)(
    "%s keyboard navigation follows direction",
    async (dir, key, heading) => {
      await render(<TourFixture dir={dir} />)
      await page.getByRole("button", {name: labels.start}).click()
      await currentDialog().click()
      await userEvent.keyboard(key)

      await expect.element(currentHeading(heading)).toBeVisible()
    },
  )

  test("keyboardNavigation=false disables arrow navigation", async () => {
    await render(<TourFixture keyboardNavigation={false} />)
    await page.getByRole("button", {name: labels.start}).click()
    await currentDialog().click()
    await userEvent.keyboard("{ArrowRight}")

    await expect.element(currentHeading(labels.firstHeading)).toBeVisible()
  })

  test("overlays render and follow the real target", async () => {
    function OverlayTour() {
      const floatingPortalProps: TourFloatingPortalProps = {
        arrowProps: {"data-test-id": "tour-arrow"},
        backdropProps: {"data-test-id": "tour-backdrop"},
        spotlightProps: {"data-test-id": "tour-spotlight"},
      }
      const steps: TourStepDetails[] = [
        {
          arrow: true,
          backdrop: true,
          description: "Geometry description",
          heading: "Geometry heading",
          id: "geometry",
          target: () => document.querySelector<HTMLElement>("#geometry-target"),
          type: "tooltip",
        },
      ]

      return (
        <Tour
          floatingPortalProps={floatingPortalProps}
          preventInteraction
          steps={steps}
        >
          <Tour.Context>
            {(tour) => (
              <button onClick={() => tour.start()} type="button">
                {labels.start}
              </button>
            )}
          </Tour.Context>
          <button id="geometry-target" type="button">
            Geometry target
          </button>
        </Tour>
      )
    }

    const {unmount} = await render(<OverlayTour />)
    await page.getByRole("button", {name: labels.start}).click()

    const target = page.getByRole("button", {name: "Geometry target"})
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

    await unmount()
    expect(targetElement.inert).toBe(false)
  })

  test("translations control progress and action labels", async () => {
    const steps = createSteps()
    steps[0] = {
      ...steps[0],
      actions: [{action: "next", label: "Continue"}],
    }
    await render(
      <TourFixture
        steps={steps}
        translations={{
          nextStep: "Go forward",
          progressText: ({current, total}) => `Step ${current + 1} / ${total}`,
        }}
      />,
    )
    await page.getByRole("button", {name: labels.start}).click()

    await expect.element(page.getByText("Step 1 / 2")).toBeVisible()
    await expect
      .element(page.getByRole("button", {name: "Go forward"}))
      .toHaveTextContent("Continue")
  })

  test("duplicate step IDs throw a descriptive error", async () => {
    const duplicateSteps = [createSteps()[0], createSteps()[0]]

    await expect(
      render(<TourFixture steps={duplicateSteps} />),
    ).rejects.toThrow("[@qualcomm-ui/core/tour] Duplicate step id: first")
  })

  test("steps require a target or explicit type", async () => {
    const invalidSteps: TourStepDetails[] = [
      {
        description: "Invalid description",
        heading: "Invalid heading",
        id: "invalid",
      },
    ]

    await expect(render(<TourFixture steps={invalidSteps} />)).rejects.toThrow(
      "[@qualcomm-ui/core/tour] Step invalid has no target or type",
    )
  })
})
