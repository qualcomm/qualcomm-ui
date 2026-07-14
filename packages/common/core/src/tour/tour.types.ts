// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Placement} from "@qualcomm-ui/dom/floating-ui"
import type {InteractOutsideHandlers} from "@qualcomm-ui/dom/interact-outside"
import type {AnatomyPart, AnatomyPartName} from "@qualcomm-ui/utils/anatomy"
import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  BindableIds,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  IdRegistrationProps,
  JSX,
  Machine,
  MachineSchema,
  Scope,
} from "@qualcomm-ui/utils/machine"

import type {tourAnatomy} from "./tour.anatomy.js"
import type {Point, Rect, Size} from "./utils/rect.js"

export type TourStepEffectCleanup = VoidFunction | void

export interface TourStepEffectArgs {
  dismiss: VoidFunction
  goto: (id: string) => void
  next: VoidFunction
  show: VoidFunction
  target?: (() => HTMLElement | null) | undefined
  update: (data: Partial<TourStepBaseDetails>) => void
}

export type TourStepType = "tooltip" | "dialog" | "wait" | "floating"
export type TourStepActionType = "next" | "prev" | "dismiss" | "skip"
export type TourStepPlacement = Placement | "center"
export type TourStepActionFn = (actionMap: TourStepActionMap) => void

export interface TourStepAction {
  /** The action to perform. */
  action?: TourStepActionType | TourStepActionFn | undefined
  /** Attributes to apply to the action trigger. */
  attrs?: Record<string, unknown> | undefined
  /** The visible label for the action. */
  label: string
}

export interface TourStepBaseDetails {
  /** Actions rendered for this step. */
  actions?: TourStepAction[] | undefined
  /** Whether to show an arrow for this step. */
  arrow?: boolean | undefined
  /** Whether to show a backdrop for this step. */
  backdrop?: boolean | undefined
  /** Step description. Framework integrations narrow this value. */
  description: unknown
  /** Additional application metadata. */
  meta?: Record<string, unknown> | undefined
  /** Offset between the content and target. */
  offset?:
    | {crossAxis?: number | undefined; mainAxis?: number | undefined}
    | undefined
  /** Placement for the step content. */
  placement?: TourStepPlacement | undefined
  /** Function that returns the element to highlight. */
  target?: (() => HTMLElement | null) | undefined
  /** Step heading. Framework integrations narrow this value. */
  heading: unknown
  /** Step type. A step without a target must provide a type. */
  type?: TourStepType | undefined
}

export interface TourStepDetails extends TourStepBaseDetails {
  /** Effect run before the step is shown. */
  effect?: ((args: TourStepEffectArgs) => TourStepEffectCleanup) | undefined
  /** Unique step identifier. */
  id: string
}

export interface TourStepChangeDetails {
  complete: boolean
  progress: number
  stepId: string | null
  stepIndex: number
  totalSteps: number
}

export interface TourStepsChangeDetails {
  steps: TourStepDetails[]
}

export type TourStepStatus =
  | "idle"
  | "started"
  | "skipped"
  | "completed"
  | "dismissed"
  | "not-found"

export interface TourStepActionMap {
  dismiss: VoidFunction
  goto: (id: string) => void
  next: VoidFunction
  prev: VoidFunction
  skip: VoidFunction
}

export interface TourStatusChangeDetails {
  status: TourStepStatus
  stepId: string | null
  stepIndex: number
}

export interface TourProgressTextDetails {
  current: number
  total: number
}

export interface TourTranslations {
  close?: string | undefined
  nextStep?: string | undefined
  prevStep?: string | undefined
  progressText?: ((details: TourProgressTextDetails) => string) | undefined
  skip?: string | undefined
}

export interface TourElementIds {
  arrow: string
  backdrop: string
  content: string
  description: string
  positioner: string
  heading: string
}

export interface TourApiProps
  extends CommonProperties, DirectionProperty, InteractOutsideHandlers {
  /** Whether Escape dismisses the tour. @default true */
  closeOnEscape?: boolean | undefined
  /** Whether outside interaction dismisses the tour. @default true */
  closeOnInteractOutside?: boolean | undefined
  /** Element IDs used by the Tour parts. */
  ids?: Partial<TourElementIds> | undefined
  /** Whether left and right arrow keys navigate. @default true */
  keyboardNavigation?: boolean | undefined
  /** Called when lifecycle status changes. */
  onStatusChange?: ((details: TourStatusChangeDetails) => void) | undefined
  /** Called when the active step changes. */
  onStepChange?: ((details: TourStepChangeDetails) => void) | undefined
  /** Called when the step collection changes. */
  onStepsChange?: ((details: TourStepsChangeDetails) => void) | undefined
  /** Prevent interaction with the highlighted target. @default false */
  preventInteraction?: boolean | undefined
  /** Offset applied around the spotlight. @default {x: 10, y: 10} */
  spotlightOffset?: Point | undefined
  /** Spotlight corner radius. @default 4 */
  spotlightRadius?: number | undefined
  /** Controlled active step ID. */
  stepId?: string | null | undefined
  /** Tour steps. */
  steps?: TourStepDetails[] | undefined
  /** Accessible translations. */
  translations?: TourTranslations | undefined
}

type TourPropsWithDefault =
  | "closeOnEscape"
  | "closeOnInteractOutside"
  | "dir"
  | "keyboardNavigation"
  | "preventInteraction"
  | "spotlightOffset"
  | "spotlightRadius"
  | "translations"

interface TourPrivateContext {
  boundarySize: Size
  currentPlacement?: TourStepPlacement | undefined
  resolvedTarget: HTMLElement | null
  stepId: string | null
  steps: TourStepDetails[]
  targetRect: Rect
}

interface TourRefs {
  effectCleanup?: TourStepEffectCleanup | undefined
  internalChange?: boolean | undefined
  previousTarget?: HTMLElement | null | undefined
  targetCleanup?: VoidFunction | undefined
}

interface TourComputedContext {
  hasNextStep: boolean
  hasPrevStep: boolean
  isFirstStep: boolean
  isLastStep: boolean
  progress: number
  step: TourStepDetails | null
  stepIndex: number
}

export type TourEvent =
  | {node: HTMLElement; type: "TARGET.RESOLVED"}
  | {src?: string; type: "DISMISS"}
  | {src?: string; type: "SKIP"}
  | {src?: string; type: "STEP.NEXT"}
  | {src?: string; type: "STEP.PREV"}
  | {src?: string; type: "STEP.ROUTE"}
  | {src?: string; type: "STEP.CHANGED"}
  | {src?: string; type: "STEP.SET"; value: number | string}
  | {src?: string; type: "STEPS.SET"; value: TourStepDetails[]}
  | {type: "SCROLL.END"}
  | {type: "START"; value?: number | string | undefined}
  | {type: "TARGET.NOT_FOUND"}

export interface TourSchema extends MachineSchema {
  actions: ActionSchema<
    | "cleanupAll"
    | "cleanupStepEffect"
    | "clearStep"
    | "invokeOnComplete"
    | "invokeOnDismiss"
    | "invokeOnNotFound"
    | "invokeOnSkip"
    | "invokeOnStart"
    | "scrollToTarget"
    | "setInitialStep"
    | "setNextStep"
    | "setPrevStep"
    | "setResolvedTarget"
    | "setStep"
    | "setSteps"
    | "validateSteps"
  >
  computed: TourComputedContext
  context: TourPrivateContext
  effects: EffectSchema<
    | "trackBoundarySize"
    | "trackDismissableBranch"
    | "trackEscapeKeydown"
    | "trackInteractOutside"
    | "trackPlacement"
    | "trapFocus"
    | "waitForScrollEnd"
    | "waitForTarget"
    | "waitForTargetTimeout"
  >
  events: TourEvent
  guards: GuardSchema<
    | "hasResolvedTarget"
    | "hasTarget"
    | "isLastStep"
    | "isTourActive"
    | "isValidStep"
    | "isWaitingStep"
  >
  ids: TourElementIds
  props: RequiredBy<TourApiProps, TourPropsWithDefault>
  refs: TourRefs
  state:
    | "tourInactive"
    | "running.resolving"
    | "running.scrolling"
    | "running.waiting"
    | "running.active"
  tag: "open" | "closed"
}

export interface TourScope extends Scope {
  ids: BindableIds<TourSchema>
}

type TourPartName = AnatomyPartName<typeof tourAnatomy>
interface TourPart<P extends TourPartName> extends AnatomyPart<"tour", P> {}

export interface TourBackdropBindings extends TourPart<"backdrop"> {
  "data-state": "open" | "closed"
  "data-type": TourStepType | undefined
  dir: Direction
  hidden: boolean
  id: string
  style: JSX.CSSProperties
}

export interface TourSpotlightBindings extends TourPart<"spotlight"> {
  hidden: boolean
  style: JSX.CSSProperties
}

export interface TourProgressTextBindings extends TourPart<"progressText"> {}

export interface TourPositionerBindings extends TourPart<"positioner"> {
  "data-placement": TourStepPlacement | undefined
  "data-type": TourStepType | undefined
  dir: Direction
  id: string
  style: JSX.CSSProperties
}

export interface TourArrowBindings extends TourPart<"arrow"> {
  dir: Direction
  hidden: boolean
  id: string
  opacity: number | undefined
  style: JSX.CSSProperties | undefined
}

export interface TourArrowTipBindings extends TourPart<"arrowTip"> {
  dir: Direction
  style: JSX.CSSProperties
}

export interface TourContentBindings extends TourPart<"content"> {
  "aria-atomic": true
  "aria-describedby": string
  "aria-labelledby": string
  "aria-live": "polite"
  "aria-modal": true
  "data-placement": TourStepPlacement | undefined
  "data-state": "open" | "closed"
  "data-step": string | undefined
  "data-type": TourStepType | undefined
  dir: Direction
  hidden: boolean
  id: string
  onKeyDown: JSX.KeyboardEventHandler
  role: "alertdialog"
  tabIndex: -1
}

export interface TourHeadingBindings extends TourPart<"heading"> {
  "data-placement": TourStepPlacement | "center" | undefined
  id: string
}

export interface TourDescriptionBindings extends TourPart<"description"> {
  "data-placement": TourStepPlacement | "center" | undefined
  id: string
}

export interface TourCloseTriggerBindings extends TourPart<"closeTrigger"> {
  "aria-label": string | undefined
  "data-type": TourStepType | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface TourActionTriggerBindings extends TourPart<"actionTrigger"> {
  "aria-label"?: string | undefined
  "data-disabled"?: BooleanDataAttr | undefined
  "data-type": "next" | "prev" | "close" | "skip" | "custom"
  disabled?: boolean | undefined
  onClick: JSX.MouseEventHandler
  type: "button"
}

export interface TourApi {
  addStep: (step: TourStepDetails) => void
  firstStep: boolean
  getActionTriggerBindings: (action: TourStepAction) => TourActionTriggerBindings
  getArrowBindings: (props: IdRegistrationProps) => TourArrowBindings
  getArrowTipBindings: () => TourArrowTipBindings
  getBackdropBindings: (props: IdRegistrationProps) => TourBackdropBindings
  getCloseTriggerBindings: () => TourCloseTriggerBindings
  getContentBindings: (props: IdRegistrationProps) => TourContentBindings
  getDescriptionBindings: (props: IdRegistrationProps) => TourDescriptionBindings
  getPositionerBindings: (props: IdRegistrationProps) => TourPositionerBindings
  getProgressPercent: () => number
  getProgressText: () => string
  getProgressTextBindings: () => TourProgressTextBindings
  getSpotlightBindings: () => TourSpotlightBindings
  getHeadingBindings: (props: IdRegistrationProps) => TourHeadingBindings
  hasNextStep: boolean
  hasPrevStep: boolean
  isCurrentStep: (id: string) => boolean
  isValidStep: (id: string) => boolean
  lastStep: boolean
  next: VoidFunction
  open: boolean
  prev: VoidFunction
  removeStep: (id: string) => void
  setStep: (id: string) => void
  setSteps: (steps: TourStepDetails[]) => void
  start: (id?: string) => void
  step: TourStepDetails | null
  stepIndex: number
  totalSteps: number
  updateStep: (id: string, stepOverrides: Partial<TourStepDetails>) => void
}

export type TourMachine = Machine<TourSchema>
export type {Point} from "./utils/rect.js"
