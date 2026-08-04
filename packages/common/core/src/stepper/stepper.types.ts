// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  BindableIds,
  CommonProperties,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  MachineSchema,
  Scope,
} from "@qualcomm-ui/utils/machine"

import type {stepperAnatomy} from "./stepper.anatomy.js"

export type StepperOrientation =
  | "horizontal"
  | "horizontal-inline"
  | "horizontal-bottom-start"
  | "vertical"
  | "vertical-inline"

export interface CanGoToStepDetails {
  /**
   * The current active step index.
   */
  current: number

  /**
   * The step index being navigated to.
   */
  target: number

  /**
   * Whether the target step has been previously visited.
   */
  visited: boolean
}

export interface StepInvalidDetails {
  action: "next" | "set"
  step: number
  targetStep?: number
}

export interface StepperApiProps extends DirectionProperty, CommonProperties {
  /**
   * Whether navigation to a step should be allowed. Receives the current step,
   * target step, and whether the target has been previously visited.
   *
   * Return `false` to block navigation, `true` to allow it, or `undefined`
   * to defer to the built-in navigation rules.
   */
  canGoToStep?:
    | ((details: CanGoToStepDetails) => boolean | undefined)
    | undefined

  /**
   * A map of step indices to their completion status. In {@link linear} mode,
   * steps before the current step are automatically completed. Use this to
   * override or set completion status for individual steps. Note that this property
   * is purely visual and does not impact navigation logic.
   */
  completed?: Record<number, boolean> | undefined

  /**
   * The total number of steps
   */
  count: number

  /**
   * The initial value of the stepper when rendered.
   * Use when you don't need to control the value of the stepper.
   */
  defaultStep?: number | undefined

  /**
   * A map of step indices to their invalid status. Note that this property is
   * purely visual and does not impact navigation logic.
   */
  invalid?: Record<number, boolean> | undefined

  /**
   * Whether a step can be skipped during navigation in {@link linear} mode.
   * Skippable steps are bypassed when using next/prev.
   * @default () => false
   */
  isStepSkippable?: ((index: number) => boolean) | undefined

  /**
   * If `true`, the stepper requires the user to complete the steps in order.
   *
   * @default true
   */
  linear?: boolean | undefined

  /**
   * Callback to be called when the value changes
   */
  onStepChange?: ((step: number) => void) | undefined

  /**
   * Called when navigation is blocked due to an invalid step.
   */
  onStepInvalid?: ((details: StepInvalidDetails) => void) | undefined

  /**
   * The orientation of the stepper
   * @default "horizontal"
   */
  orientation?: StepperOrientation | undefined

  /**
   * A map of step indices to their pending status.
   */
  pending?: Record<number, boolean> | undefined

  /**
   * The controlled value of the stepper
   */
  step?: number | undefined
}

export interface StepperElementIds {
  content: string[]
  list: string
  root: string
  trigger: string[]
}

export interface StepperScope extends Scope {
  ids: BindableIds<StepperSchema>
}

export interface StepperSchema extends MachineSchema {
  actions: ActionSchema<
    | "goToNextStep"
    | "goToPrevStep"
    | "invokeOnStepInvalid"
    | "resetStep"
    | "setStep"
    | "validateStepIndex"
  >
  computed: {
    hasNextStep: boolean
    hasPrevStep: boolean
  }
  context: {
    step: number
    visited: Record<number, boolean>
  }
  events:
    | {
        src: string
        type: "STEP.PREV" | "STEP.RESET"
      }
    | {
        src: string
        type: "STEP.NEXT" | "STEP.SET"
        value: number
      }
  guards: GuardSchema<"isValidStepNavigation">
  ids: StepperElementIds
  props: RequiredBy<
    StepperApiProps,
    "count" | "defaultStep" | "dir" | "linear" | "orientation"
  >
  state: "idle"
}

export interface StepperItemProps {
  /**
   * The index of the step
   */
  index: number
}

export interface StepperItemState extends StepperItemProps {
  /**
   * Whether the step is completed
   */
  completed: boolean

  /**
   * The id of the step's content element
   */
  contentId: string

  /**
   * Whether the step is the current active step
   */
  current: boolean

  /**
   * Whether the step is the first step
   */
  first: boolean

  /**
   * Whether the step is incomplete
   */
  incomplete: boolean

  /**
   * Whether the step is invalid
   */
  invalid: boolean

  /**
   * Whether the step is the last step
   */
  last: boolean

  /**
   * Whether the step has been marked as in progress.
   */
  pending?: boolean

  /**
   * Whether this step is a previous step
   */
  previous?: boolean

  /**
   * Whether the step can be skipped
   */
  skippable: boolean

  /**
   * The id of the step's trigger element
   */
  triggerId: string

  /**
   * Whether the step has been visited
   */
  visited: boolean
}

type PartName = AnatomyPartName<typeof stepperAnatomy>
interface Part<P extends PartName>
  extends AnatomyPart<"stepper", P>, Required<DirectionProperty> {}

export interface StepperRootBindings extends Part<"root"> {
  "data-orientation": StepperOrientation
  id: string
}

export interface StepperListBindings extends Part<"list"> {
  "aria-orientation": "horizontal" | "vertical"
  "aria-owns": string
  "data-orientation": StepperOrientation
  id: string
  role: "tablist"
}

export interface StepperItemBindings extends Part<"item"> {
  "data-current": BooleanDataAttr
  "data-first": BooleanDataAttr
  "data-last": BooleanDataAttr
  "data-orientation": StepperOrientation
  "data-previous": BooleanDataAttr
  "data-skippable": BooleanDataAttr
  role: "none"
}

export interface StepperTriggerBindings extends Part<"trigger"> {
  "aria-controls": string
  "aria-current": "step" | undefined
  "aria-disabled": BooleanAriaAttr
  "aria-selected": boolean
  "data-complete": BooleanDataAttr
  "data-current": BooleanDataAttr
  "data-incomplete": BooleanDataAttr
  "data-invalid": BooleanDataAttr
  "data-last": BooleanDataAttr
  "data-orientation": StepperOrientation
  "data-pending": BooleanDataAttr
  "data-state": "open" | "closed"
  id: string
  onClick: JSX.MouseEventHandler
  role: "tab"
  tabIndex: 0 | -1
}

export interface StepperContentBindings extends Part<"content"> {
  "aria-labelledby": string
  "data-orientation": StepperOrientation
  "data-state": "open" | "closed"
  hidden: boolean
  id: string
  role: "tabpanel"
  tabIndex: 0
}

export interface StepperIndicatorBindings extends Part<"indicator"> {
  "aria-hidden": true
  "data-complete": BooleanDataAttr
  "data-current": BooleanDataAttr
  "data-incomplete": BooleanDataAttr
  "data-orientation": StepperOrientation
  style: JSX.CSSProperties
}

export interface StepperSeparatorBindings extends Part<"separator"> {
  "data-complete": BooleanDataAttr
  "data-incomplete": BooleanDataAttr
  "data-orientation": StepperOrientation
  style: JSX.CSSProperties | undefined
}

export interface StepperLabelBindings extends Part<"label"> {
  "data-complete": BooleanDataAttr
  "data-current": BooleanDataAttr
  "data-incomplete": BooleanDataAttr
  "data-orientation": StepperOrientation
}

export interface StepperCompletedContentBindings extends Part<"completedContent"> {
  hidden: boolean
}

export interface StepperHintBindings extends Part<"hint"> {
  "data-complete": BooleanDataAttr
  "data-current": BooleanDataAttr
  "data-incomplete": BooleanDataAttr
  "data-orientation": StepperOrientation
}

export interface StepperNextTriggerBindings extends Part<"nextTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface StepperPrevTriggerBindings extends Part<"prevTrigger"> {
  "data-disabled": BooleanDataAttr
  disabled: boolean
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface StepperApi {
  /**
   * The total number of steps.
   */
  count: number

  /**
   * Returns the resolved state for a step at the given index.
   */
  getItemState: (props: StepperItemProps) => StepperItemState

  /**
   * Function to go to the next step.
   */
  goToNextStep: () => void

  /**
   * Function to go to the previous step.
   */
  goToPrevStep: () => void

  /**
   * Whether the stepper has a next step.
   */
  hasNextStep: boolean

  /**
   * Whether the stepper has a previous step.
   */
  hasPrevStep: boolean

  /**
   * Check if a specific step can be skipped
   */
  isStepSkippable: (index: number) => boolean

  /**
   * Function to go to reset the stepper.
   */
  resetStep: () => void

  /**
   * Function to set the value of the stepper.
   */
  setStep: (step: number) => void

  /**
   * The value of the stepper.
   */
  step: number

  // group: bindings
  getCompletedContentBindings: () => StepperCompletedContentBindings
  getContentBindings: (
    props: StepperItemProps & IdRegistrationProps,
  ) => StepperContentBindings
  getHintBindings: (props: StepperItemProps) => StepperHintBindings
  getIndicatorBindings: (props: StepperItemProps) => StepperIndicatorBindings
  getItemBindings: (props: StepperItemProps) => StepperItemBindings
  getLabelBindings: (props: StepperItemProps) => StepperLabelBindings
  getListBindings: (props: IdRegistrationProps) => StepperListBindings
  getNextTriggerBindings: () => StepperNextTriggerBindings
  getPrevTriggerBindings: () => StepperPrevTriggerBindings
  getRootBindings: (props: IdRegistrationProps) => StepperRootBindings
  getSeparatorBindings: (props: StepperItemProps) => StepperSeparatorBindings
  getTriggerBindings: (
    props: StepperItemProps & IdRegistrationProps,
  ) => StepperTriggerBindings
}
