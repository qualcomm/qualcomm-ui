// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  BooleanAriaAttr,
  BooleanDataAttr,
} from "@qualcomm-ui/utils/attributes"
import type {Direction, DirectionProperty} from "@qualcomm-ui/utils/direction"
import type {RequiredBy} from "@qualcomm-ui/utils/guard"
import type {
  ActionSchema,
  CommonProperties,
  EffectSchema,
  GuardSchema,
  JSX,
  Machine,
  MachineSchema,
} from "@qualcomm-ui/utils/machine"

export type ToastType =
  | "success"
  | "danger"
  | "loading"
  | "info"
  | "warning"
  | "neutral"

export type ToastPlacement =
  | "top-start"
  | "top"
  | "top-end"
  | "bottom-start"
  | "bottom"
  | "bottom-end"

export type ToastStatus = "visible" | "dismissing" | "unmounted"

export interface ToastStatusChangeDetails {
  /**
   * The reason for the status change
   */
  src?: string | undefined

  /**
   * The render status of the toast
   */
  status: ToastStatus
}

export interface ToastHeight {
  /**
   * The height of the toast
   */
  height: number

  /**
   * The id of the toast
   */
  id: string
}

export interface ToastActionOptions {
  /**
   * The label of the action
   */
  label: string

  /**
   * The function to call when the action is clicked
   */
  onClick: () => void
}

export interface ToastOptions<T = any> {
  /**
   * The action of the toast
   */
  action?: ToastActionOptions | undefined

  /**
   * Whether the toast is closable
   * @default true
   */
  closable?: boolean

  /**
   * The description of the toast.
   */
  description?: T | undefined

  /**
   * The duration the toast will be visible, in milliseconds.
   */
  duration?: number | undefined

  /**
   * The unique id of the toast
   */
  id?: string | undefined

  /**
   * The title of the toast.
   */
  label?: T | undefined

  /**
   * The metadata of the toast. Use this to provide additional information about the
   * toast for use in your own component
   */
  meta?: Record<string, any> | undefined

  /**
   * Function called when the toast is visible
   * @inheritDoc
   */
  onStatusChange?: ((details: ToastStatusChangeDetails) => void) | undefined

  /**
   * @internal
   * The promise of the toast
   */
  promise?: Promise<any> | (() => Promise<any>) | undefined

  /**
   * The duration the toast will be visible, in milliseconds.
   * Required for exit transitions.
   * @default 200
   */
  removeDelay?: number | undefined

  /**
   * The type of the toast. Controls the color and icon of the toast.
   */
  type?: ToastType | undefined
}

export interface ToastApiProps<T = any>
  extends Omit<CommonProperties, "id">,
    ToastOptions<T> {
  /**
   * The direction of the toast
   */
  dir?: Direction | undefined

  /**
   * @internal
   * Whether to dismiss the toast
   */
  dismiss?: boolean | undefined

  /**
   * The gap of the toast
   */
  gap?: number | undefined

  /**
   * @internal
   * The index of the toast
   */
  index?: number | undefined

  /**
   * @internal
   * The event to be dispatched
   */
  message?: any | undefined

  /**
   * @internal
   * The parent of the toast
   */
  parent: Machine<ToastGroupSchema>

  /**
   * @internal
   * Whether the toast is stacked
   */
  stacked?: boolean | undefined
}

type ToastPropsWithDefault =
  | "type"
  | "parent"
  | "duration"
  | "id"
  | "removeDelay"

export type ToastSchema<T = any> = {
  actions: ActionSchema<
    | "invokeOnDismiss"
    | "invokeOnUnmount"
    | "invokeOnVisible"
    | "measureHeight"
    | "notifyParentToRemove"
    | "resetCloseTimer"
    | "setCloseTimer"
    | "setMounted"
    | "syncRemainingTime"
  >
  computed: {
    frontmost: boolean
    height: number
    heightBefore: number
    heightIndex: number
    shouldPersist: boolean
    zIndex: number
  }
  context: {
    initialHeight: number
    mounted: boolean
    remainingTime: number
  }
  effects: EffectSchema<
    "trackHeight" | "waitForDuration" | "waitForNextTick" | "waitForRemoveDelay"
  >
  events: any
  guards: GuardSchema<"isLoadingType" | "shouldPersist">
  props: RequiredBy<ToastApiProps<T>, ToastPropsWithDefault>
  refs: {
    closeTimerStartTime: number
  }
  state:
    | "visible"
    | "visible:updating"
    | "dismissing"
    | "unmounted"
    | "visible:persist"
  tag: "visible" | "paused" | "updating"
}

export interface ToasterCreateOptions {
  /**
   * The duration the toast will be visible, in milliseconds.
   * By default, this is determined by the {@link type} of the toast.
   */
  duration?: number | undefined

  /**
   * The gap between the toasts
   * @default 16
   */
  gap?: number | undefined

  /**
   * The maximum number of toasts. When the number of toasts exceeds this limit, the new toasts are queued.
   * @default 12
   */
  max?: number | undefined

  /**
   * The offset from the safe environment edge of the viewport
   * @default "1rem"
   */
  offsets?:
    | string
    | Record<"left" | "right" | "bottom" | "top", string>
    | undefined

  /**
   * Whether to overlap the toasts
   * @default false
   */
  overlap?: boolean | undefined

  /**
   * Whether to pause toast when the user leaves the browser tab
   * @default true
   */
  pauseOnPageIdle?: boolean | undefined

  /**
   * The placement of the toast
   * @default "bottom-end"
   */
  placement?: ToastPlacement | undefined

  /**
   * The duration for the toast to kept alive before it is removed.
   * Useful for exit transitions.
   *
   * @default 200
   */
  removeDelay?: number | undefined
}

export interface ToastGroupProps extends DirectionProperty, CommonProperties {
  id?: string

  /**
   * The store of the toast
   */
  store: ToastStore
}

export interface ToastGroupSchema<T = any> extends MachineSchema {
  actions: ActionSchema<
    | "clearDismissableBranch"
    | "clearLastFocusedEl"
    | "collapsedIfEmpty"
    | "collapseToasts"
    | "expandToasts"
    | "focusRegionEl"
    | "pauseToasts"
    | "removeHeight"
    | "removeToast"
    | "restoreLastFocusedEl"
    | "resumeToasts"
    | "setDismissableBranch"
    | "setLastFocusedEl"
  >
  computed: {
    count: number
    overlap: boolean
    placement: ToastPlacement
  }
  context: {
    heights: ToastHeight[]
    toasts: RequiredBy<ToastApiProps<T>, ToastPropsWithDefault>[]
  }
  effects: EffectSchema<"subscribeToStore" | "trackDocumentVisibility">
  events: any
  guards: GuardSchema<"isOverlapping">
  props: ToastGroupProps
  refs: {
    dismissableCleanup?: VoidFunction | undefined
    isFocusWithin: boolean
    lastFocusedEl: HTMLElement | null
  }
  state: "stack" | "overlap"
}

export interface ToastStore<V = any> {
  /**
   * The attributes of the toast store
   * @inheritDoc
   */
  attrs: Required<ToasterCreateOptions>

  /**
   * @internal
   * Collapse all toasts to their compact state
   */
  collapse: () => void

  /**
   * Create a new toast with the given options
   * @inheritDoc
   */
  create: (data: ToastOptions<V>) => string

  /**
   * Dismiss a toast by its ID. If no ID is provided, dismisses all toasts
   */
  dismiss: (id?: string) => void

  /**
   * @internal
   * Expand all toasts to show their full content
   */
  expand: () => void

  /**
   * Get the total number of toasts
   */
  getCount: () => number

  /**
   * Get all currently visible toasts
   * @inheritDoc
   */
  getVisibleToasts: () => Partial<ToastApiProps<V>>[]

  /**
   * Check if a toast with the given ID has been dismissed
   */
  isDismissed: (id: string) => boolean

  /**
   * Check if a toast with the given ID is currently visible
   */
  isVisible: (id: string) => boolean

  /**
   * Pause a toast's auto-dismiss timer. If no ID is provided, pauses all toasts
   */
  pause: (id?: string) => void

  /**
   * Create a toast that tracks a promise's state
   * @inheritDoc
   */
  promise: <T>(
    promise: Promise<T> | (() => Promise<T>),
    options: ToastPromiseOptions<V>,
    shared?: Omit<ToastOptions<V>, "type">,
  ) => {id: string | undefined; unwrap: () => Promise<T>} | undefined

  /**
   * Remove a toast by its ID
   */
  remove: (id?: string) => void

  /**
   * Resume a toast's auto-dismiss timer. If no ID is provided, resumes all toasts
   */
  resume: (id?: string) => void

  /**
   * Subscribe to the toast store
   */
  subscribe: (subscriber: (...args: any[]) => void) => VoidFunction

  /**
   * Update an existing toast with new properties
   * @inheritDoc
   */
  update: (id: string, data: Partial<ToastApiProps<V>>) => string
}

export interface ToastPromiseOptions<V = any> {
  /**
   * The function called when the Promise is rejected.
   * @inheritDoc
   */
  error?: ((response: any) => Omit<ToastOptions<V>, "type">) | undefined

  /**
   * The function called after the Promise is resolved successfully or rejected.
   */
  finally?: (() => void | Promise<void>) | undefined

  /**
   * The options for the toast that displays while the Promise is pending.
   * @inheritDoc
   */
  loading: Omit<ToastOptions<V>, "type">

  /**
   * The function called when the Promise is resolved successfully.
   * @inheritDoc
   */
  success?: ((response: any) => Omit<ToastOptions<V>, "type">) | undefined
}

export interface GroupProps {
  /**
   * The human-readable label for the toast region
   */
  label?: string | undefined
}

export interface ToastGroupBindings extends ToastCommonBindings {
  "aria-label": string
  "aria-live": "polite"
  "data-align": ToastAlign
  "data-placement": ToastPlacement
  "data-side": ToastSide
  id: string
  onBlur: JSX.FocusEventHandler<HTMLElement>
  onFocus: JSX.FocusEventHandler<HTMLElement>
  onMouseLeave: JSX.MouseEventHandler<HTMLElement>
  onMouseMove: JSX.MouseEventHandler<HTMLElement>
  role: "region"
  style: JSX.CSSProperties
  tabIndex: -1
}

export interface ToastGroupApi<T = any> {
  /**
   * The total number of toasts
   */
  getCount: () => number

  /**
   * The toasts
   */
  getToasts: () => ToastApiProps<T>[]

  /**
   * Subscribe to the toast group
   */
  subscribe: (callback: (toasts: ToastOptions<T>[]) => void) => VoidFunction

  // group: bindings
  getGroupBindings: (options?: GroupProps) => ToastGroupBindings
}

export interface ToastCommonBindings extends DirectionProperty {
  "data-scope": "toast"
}

export type ToastSide = "top" | "bottom"
export type ToastAlign = "start" | "center" | "end"
export type ToastState = "open" | "closed"

export interface ToastRootBindings {
  "aria-atomic": BooleanAriaAttr
  "aria-describedby": string | undefined
  "aria-labelledby": string | undefined
  "data-align": ToastAlign
  "data-first": BooleanDataAttr
  "data-mounted": BooleanDataAttr
  "data-overlap": BooleanDataAttr
  "data-paused": BooleanDataAttr
  "data-placement": ToastPlacement
  "data-sibling": BooleanDataAttr
  "data-side": ToastSide
  "data-stack": BooleanDataAttr
  "data-state": ToastState
  "data-type": ToastType
  onKeyDown: JSX.KeyboardEventHandler<HTMLElement>
  role: "status"
  style: JSX.CSSProperties
  tabIndex: 0
}

export interface ToastActionTriggerBindings extends ToastCommonBindings {
  "data-part": "action-trigger"
  onClick: JSX.MouseEventHandler<HTMLElement>
  type: "button"
}

export interface ToastCloseTriggerBindings extends ToastCommonBindings {
  "aria-label": "Dismiss notification"
  "data-part": "close-trigger"
  id: string
  onClick: JSX.MouseEventHandler<HTMLElement>
  type: "button"
}

export interface ToastDescriptionBindings extends ToastCommonBindings {
  "data-part": "description"
  id: string
}

export interface ToastGhostAfterBindings extends ToastCommonBindings {
  "data-ghost": "after"
  "data-part": "ghost-after"
  style: JSX.CSSProperties
}

export interface ToastGhostBeforeBindings extends ToastCommonBindings {
  "data-ghost": "before"
  "data-part": "ghost-before"
  style: JSX.CSSProperties
}

export interface ToastLabelBindings extends ToastCommonBindings {
  "data-part": "label"
  id: string
}

export interface ToastApi<T = any> {
  /**
   * The action of the toast.
   */
  action?: ToastActionOptions | undefined
  /**
   * Whether the toast should render a close button
   */
  closable: boolean
  /**
   * The description of the toast.
   */
  description?: T | undefined
  /**
   * Function to instantly dismiss the toast.
   */
  dismiss: VoidFunction
  /**
   * The title of the toast.
   */
  label?: T | undefined
  /**
   * Function to pause the toast (keeping it visible).
   */
  pause: VoidFunction
  /**
   * Whether the toast is paused.
   */
  paused: boolean
  /**
   * The current placement of the toast.
   */
  placement: ToastPlacement
  /**
   * Function to resume the toast dismissing.
   */
  resume: VoidFunction
  /**
   * The type of the toast.
   */
  type: ToastType
  /**
   * Whether the toast is visible.
   */
  visible: boolean

  // group: bindings
  getActionTriggerBindings: () => ToastActionTriggerBindings
  getCloseTriggerBindings: () => ToastCloseTriggerBindings
  getDescriptionBindings: () => ToastDescriptionBindings
  getGhostAfterBindings: () => ToastGhostAfterBindings
  getGhostBeforeBindings: () => ToastGhostBeforeBindings
  getLabelBindings: () => ToastLabelBindings
  getRootBindings: () => ToastRootBindings
}
