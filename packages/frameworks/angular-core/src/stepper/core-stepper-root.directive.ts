// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {DOCUMENT} from "@angular/common"
import {
  booleanAttribute,
  computed,
  Directive,
  inject,
  Injector,
  input,
  type OnInit,
  output,
} from "@angular/core"

import {
  useId,
  useIsMounted,
  useOnDestroy,
} from "@qualcomm-ui/angular-core/common"
import {
  normalizeProps,
  useMachine,
  useTrackBindings,
} from "@qualcomm-ui/angular-core/machine"
import type {SignalifyInput} from "@qualcomm-ui/angular-core/signals"
import {
  type CanGoToStepDetails,
  createStepperApi,
  type StepInvalidDetails,
  type StepperApiProps,
  stepperMachine,
  type StepperOrientation,
} from "@qualcomm-ui/core/stepper"
import type {Booleanish} from "@qualcomm-ui/utils/coercion"
import type {Direction} from "@qualcomm-ui/utils/direction"
import type {Explicit} from "@qualcomm-ui/utils/guard"

import {StepperContextService} from "./stepper-context.service"

@Directive()
export class CoreStepperRootDirective
  implements OnInit, SignalifyInput<StepperApiProps>
{
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be generated for accessibility.
   */
  readonly id = input<string>()

  /**
   * Whether navigation to a step should be allowed. Receives the current step,
   * target step, and whether the target has been previously visited.
   *
   * Return `false` to block navigation, `true` to allow it, or `undefined`
   * to defer to the built-in navigation rules.
   */
  readonly canGoToStep = input<
    ((details: CanGoToStepDetails) => boolean | undefined) | undefined
  >()

  /**
   * A map of step indices to their completion status. In linear mode,
   * steps before the current step are automatically completed.
   */
  readonly completed = input<Record<number, boolean> | undefined>()

  /**
   * The total number of steps
   */
  readonly count = input.required<number>()

  /**
   * The initial value of the stepper when rendered.
   * Use when you don't need to control the value of the stepper.
   */
  readonly defaultStep = input<number | undefined>()

  /**
   * The document's text/writing direction.
   *
   * @default "ltr"
   */
  readonly dir = input<Direction | undefined>(undefined)

  /**
   * A root node to correctly resolve the Document in custom environments.
   */
  readonly getRootNode = input<
    (() => ShadowRoot | Document | Node) | undefined
  >()

  /**
   * A map of step indices to their invalid status.
   */
  readonly invalid = input<Record<number, boolean> | undefined>()

  /**
   * Whether a step can be skipped during navigation in linear mode.
   * @default () => false
   */
  readonly isStepSkippable = input<((index: number) => boolean) | undefined>()

  /**
   * If `true`, the stepper requires the user to complete the steps in order.
   *
   * @default true
   */
  readonly linear = input<boolean | undefined, Booleanish>(undefined, {
    transform: booleanAttribute,
  })

  /**
   * The orientation of the stepper
   * @default "horizontal"
   */
  readonly orientation = input<StepperOrientation | undefined>()

  /**
   * A map of step indices to their pending status.
   */
  readonly pending = input<Record<number, boolean> | undefined>()

  /**
   * The controlled value of the stepper
   */
  readonly step = input<number | undefined>()

  /**
   * Callback to be called when the value changes
   */
  readonly stepChanged = output<number>()

  /**
   * Called when navigation is blocked due to an invalid step.
   */
  readonly stepInvalid = output<StepInvalidDetails>()

  protected readonly document = inject(DOCUMENT)
  protected readonly injector = inject(Injector)
  protected readonly onDestroy = useOnDestroy()

  protected readonly isMounted = useIsMounted()

  protected readonly hostId = computed(() => useId(this, this.id()))

  protected readonly stepperApi = inject(StepperContextService)

  protected readonly trackBindings = useTrackBindings(() => {
    return this.stepperApi.context().getRootBindings({
      id: this.hostId(),
      onDestroy: this.onDestroy,
    })
  })

  ngOnInit() {
    const machine = useMachine(
      stepperMachine,
      computed<Explicit<StepperApiProps>>(() => ({
        canGoToStep: this.canGoToStep(),
        completed: this.completed(),
        count: this.count(),
        defaultStep: this.defaultStep(),
        dir: this.dir(),
        getRootNode: this.getRootNode() ?? (() => this.document),
        invalid: this.invalid(),
        isStepSkippable: this.isStepSkippable(),
        linear: this.linear(),
        onStepChange: (value) => {
          if (this.isMounted()) {
            this.stepChanged.emit(value)
          }
        },
        onStepInvalid: (details) => {
          if (this.isMounted()) {
            this.stepInvalid.emit(details)
          }
        },
        orientation: this.orientation(),
        pending: this.pending(),
        step: this.step(),
      })),
      this.injector,
    )

    this.stepperApi.init(
      computed(() => createStepperApi(machine, normalizeProps)),
    )

    this.trackBindings()
  }
}
