// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackDismissableBranch} from "@qualcomm-ui/dom/dismissable"
import {FocusTrap} from "@qualcomm-ui/dom/focus-trap"
import {getPlacement} from "@qualcomm-ui/dom/floating-ui"
import {trackInteractOutside} from "@qualcomm-ui/dom/interact-outside"
import {contains, isHTMLElement, waitForElement} from "@qualcomm-ui/dom/query"
import {nextIndex, prevIndex} from "@qualcomm-ui/utils/array"
import {isEqual} from "@qualcomm-ui/utils/equal"
import {isString} from "@qualcomm-ui/utils/guard"
import {
  createGuards,
  createMachine,
  type MachineConfig,
  type Params,
} from "@qualcomm-ui/utils/machine"
import {warn} from "@qualcomm-ui/utils/warning"

import {domEls, syncZIndex} from "./internal/tour.dom.js"
import type {
  TourEvent,
  TourSchema,
  TourStepDetails,
  TourStepEffectArgs,
  TourStepEffectCleanup,
  TourStepPlacement,
} from "./tour.types.js"
import {isEventInRect, offset, type Rect, type Size} from "./utils/rect.js"
import {
  findStep,
  findStepIndex,
  getEffectiveSteps,
  getProgress,
  isDialogStep,
  isTooltipStep,
  isWaitStep,
} from "./utils/step.js"

const {and} = createGuards<TourSchema>()

function validateTourSteps(steps: TourStepDetails[]): void {
  const ids = new Set<string>()
  for (const step of steps) {
    if (ids.has(step.id)) {
      throw new Error(
        `[@qualcomm-ui/core/tour] Duplicate step id: ${step.id}`,
      )
    }
    if (step.target == null && step.type == null) {
      throw new Error(
        `[@qualcomm-ui/core/tour] Step ${step.id} has no target or type. At least one of those is required.`,
      )
    }
    ids.add(step.id)
  }
}

function eventAs<T extends TourEvent["type"]>(
  event: TourEvent,
  type: T,
): Extract<TourEvent, {type: T}> {
  if (event.type !== type) {
    throw new Error(`Expected ${type} event, received ${event.type}`)
  }
  return event as Extract<TourEvent, {type: T}>
}

export const tourMachine: MachineConfig<TourSchema> =
  createMachine<TourSchema>({
    actions: {
      cleanupAll({refs}) {
        refs.get("targetCleanup")?.()
        refs.set("targetCleanup", undefined)
        refs.set("previousTarget", undefined)
        refs.get("effectCleanup")?.()
        refs.set("effectCleanup", undefined)
      },
      cleanupStepEffect({refs}) {
        refs.get("effectCleanup")?.()
        refs.set("effectCleanup", undefined)
      },
      clearStep({context, refs}) {
        refs.get("targetCleanup")?.()
        refs.set("targetCleanup", undefined)
        context.set("targetRect", {height: 0, width: 0, x: 0, y: 0})
        context.set("resolvedTarget", null)
        refs.set("internalChange", true)
        context.set("stepId", null)
      },
      invokeOnComplete({computed, context, prop}) {
        prop("onStatusChange")?.({
          status: "completed",
          stepId: context.get("stepId"),
          stepIndex: computed("stepIndex"),
        })
      },
      invokeOnDismiss({computed, context, prop}) {
        prop("onStatusChange")?.({
          status: "dismissed",
          stepId: context.get("stepId"),
          stepIndex: computed("stepIndex"),
        })
      },
      invokeOnNotFound({computed, context, prop}) {
        prop("onStatusChange")?.({
          status: "not-found",
          stepId: context.get("stepId"),
          stepIndex: computed("stepIndex"),
        })
      },
      invokeOnSkip({computed, context, prop}) {
        prop("onStatusChange")?.({
          status: "skipped",
          stepId: context.get("stepId"),
          stepIndex: computed("stepIndex"),
        })
      },
      invokeOnStart({computed, context, prop}) {
        prop("onStatusChange")?.({
          status: "started",
          stepId: context.get("stepId"),
          stepIndex: computed("stepIndex"),
        })
      },
      scrollToTarget({context}) {
        context.get("resolvedTarget")?.scrollIntoView({
          behavior: "instant",
          block: "nearest",
          inline: "nearest",
        })
      },
      setInitialStep(params) {
        const event = eventAs(params.event, "START")
        const steps = params.context.get("steps")
        if (steps.length === 0) {
          return
        }
        const index = isString(event.value)
          ? findStepIndex(steps, event.value)
          : (event.value ?? 0)
        performStepTransition(params, index)
      },
      setNextStep(params) {
        const steps = params.context.get("steps")
        performStepTransition(
          params,
          nextIndex(steps, params.computed("stepIndex")),
        )
      },
      setPrevStep(params) {
        const steps = params.context.get("steps")
        performStepTransition(
          params,
          prevIndex(steps, params.computed("stepIndex")),
        )
      },
      setResolvedTarget({computed, context, event}) {
        const targetEvent = eventAs(event, "TARGET.RESOLVED")
        context.set(
          "resolvedTarget",
          targetEvent.node ?? computed("step")?.target?.() ?? null,
        )
      },
      setStep(params) {
        const event = eventAs(params.event, "STEP.SET")
        const steps = params.context.get("steps")
        const index = isString(event.value)
          ? findStepIndex(steps, event.value)
          : event.value
        performStepTransition(params, index)
      },
      setSteps({context, event}) {
        context.set("steps", eventAs(event, "STEPS.SET").value)
      },
      validateSteps({context}) {
        validateTourSteps(context.get("steps"))
      },
    },

    computed: {
      hasNextStep: ({computed, context}) =>
        computed("stepIndex") < context.get("steps").length - 1,
      hasPrevStep: ({computed}) => computed("stepIndex") > 0,
      isFirstStep: ({computed}) => computed("stepIndex") === 0,
      isLastStep: ({computed, context}) =>
        computed("stepIndex") === context.get("steps").length - 1,
      progress: ({computed, context}) =>
        (computed("stepIndex") + 1) /
        getEffectiveSteps(context.get("steps")).length,
      step: ({context}) =>
        findStep(context.get("steps"), context.get("stepId")),
      stepIndex: ({context}) =>
        findStepIndex(context.get("steps"), context.get("stepId")),
    },

    context({bindable, getContext, prop}) {
      return {
        boundarySize: bindable<Size>(() => ({
          defaultValue: {height: 0, width: 0},
        })),
        currentPlacement: bindable<TourStepPlacement | undefined>(() => ({
          defaultValue: undefined,
        })),
        resolvedTarget: bindable<HTMLElement | null>(() => ({
          defaultValue: null,
          sync: true,
        })),
        stepId: bindable<string | null>(() => ({
          defaultValue: prop("stepId"),
          onChange(value) {
            const steps = getContext().get("steps")
            const stepIndex = findStepIndex(steps, value)
            prop("onStepChange")?.({
              complete: stepIndex === steps.length - 1,
              progress: getProgress(steps, stepIndex),
              stepId: value,
              stepIndex,
              totalSteps: steps.length,
            })
          },
          sync: true,
          value: prop("stepId"),
        })),
        steps: bindable<TourStepDetails[]>(() => ({
          defaultValue: prop("steps") ?? [],
          onChange(value) {
            prop("onStepsChange")?.({steps: value})
          },
        })),
        targetRect: bindable<Rect>(() => ({
          defaultValue: {height: 0, width: 0, x: 0, y: 0},
        })),
      }
    },

    effects: {
      trackBoundarySize({context, scope}) {
        const win = scope.getWin()
        const doc = scope.getDoc()
        const onResize = () => {
          context.set("boundarySize", {
            height: doc.documentElement.scrollHeight,
            width: win.visualViewport?.width ?? win.innerWidth,
          })
        }
        onResize()
        const viewport = win.visualViewport ?? win
        viewport.addEventListener("resize", onResize)
        return () => viewport.removeEventListener("resize", onResize)
      },
      trackDismissableBranch({computed, scope}) {
        if (!computed("step")) {
          return
        }
        let cleanupBranch: VoidFunction | undefined
        const cleanupWait = waitForElement(
          () => domEls.content(scope),
          (content) => {
            cleanupBranch = trackDismissableBranch(content)
          },
        )
        return () => {
          cleanupWait()
          cleanupBranch?.()
        }
      },
      trackEscapeKeydown({prop, scope, send}) {
        if (!prop("closeOnEscape")) {
          return
        }
        const doc = scope.getDoc()
        const onKeyDown = (event: KeyboardEvent) => {
          if (event.key === "Escape") {
            event.preventDefault()
            event.stopPropagation()
            send({src: "esc", type: "DISMISS"})
          }
        }
        doc.addEventListener("keydown", onKeyDown, true)
        return () => doc.removeEventListener("keydown", onKeyDown, true)
      },
      trackInteractOutside({computed, context, prop, scope, send}) {
        const step = computed("step")
        if (!step) {
          return
        }
        let cleanupOutside: VoidFunction | undefined
        const cleanupWait = waitForElement(
          () => domEls.content(scope),
          (content) => {
            cleanupOutside = trackInteractOutside(content, {
              exclude(target) {
                return contains(step.target?.(), target)
              },
              onFocusOutside(event) {
                prop("onFocusOutside")?.(event)
                if (!prop("closeOnInteractOutside")) {
                  event.preventDefault()
                }
              },
              onInteractOutside(event) {
                prop("onInteractOutside")?.(event)
                if (!event.defaultPrevented) {
                  send({src: "interact-outside", type: "DISMISS"})
                }
              },
              onPointerDownOutside(event) {
                prop("onPointerDownOutside")?.(event)
                if (
                  isEventInRect(
                    context.get("targetRect"),
                    event.detail.originalEvent,
                  ) ||
                  !prop("closeOnInteractOutside")
                ) {
                  event.preventDefault()
                }
              },
            })
          },
        )
        return () => {
          cleanupWait()
          cleanupOutside?.()
        }
      },
      trackPlacement({computed, context, prop, scope}) {
        const step = computed("step")
        if (!step) {
          return
        }
        context.set("currentPlacement", step.placement ?? "bottom")
        if (isDialogStep(step)) {
          let cleanupZIndex: VoidFunction | undefined
          const cleanupWait = waitForElement(
            () => domEls.content(scope),
            () => {
              cleanupZIndex = syncZIndex(scope)
            },
          )
          return () => {
            cleanupWait()
            cleanupZIndex?.()
          }
        }
        if (!isTooltipStep(step)) {
          return
        }
        let cleanupPlacement: VoidFunction | undefined
        const cleanupWait = waitForElement(
          () => domEls.positioner(scope),
          (positioner) => {
            cleanupPlacement = getPlacement(
              context.get("resolvedTarget"),
              positioner,
              {
                getAnchorRect(element) {
                  return isHTMLElement(element)
                    ? offset(
                        element.getBoundingClientRect(),
                        prop("spotlightOffset"),
                      )
                    : null
                },
                gutter: 10,
                offset: step.offset,
                onComplete(data) {
                  const rects = data.middlewareData.rects
                  if (rects) {
                    context.set("targetRect", rects.reference)
                  }
                  context.set("currentPlacement", data.placement)
                },
                placement: step.placement ?? "bottom",
                strategy: "absolute",
              },
            )
          },
        )
        return () => {
          cleanupWait()
          cleanupPlacement?.()
        }
      },
      trapFocus({computed, context, scope}) {
        if (!computed("step")) {
          return
        }
        let trap: FocusTrap | undefined
        const cleanupWait = waitForElement(
          () => domEls.content(scope),
          (content) => {
            const target = context.get("resolvedTarget")
            trap = new FocusTrap(target ? [content, target] : content, {
              allowOutsideClick: true,
              document: scope.getDoc(),
              escapeDeactivates: false,
              fallbackFocus: content,
              preventScroll: true,
              returnFocusOnDeactivate: false,
            })
            try {
              trap.activate()
            } catch {}
          },
        )
        return () => {
          cleanupWait()
          trap?.deactivate()
        }
      },
      waitForScrollEnd({send}) {
        const id = setTimeout(() => send({type: "SCROLL.END"}), 100)
        return () => clearTimeout(id)
      },
      waitForTarget({computed, scope, send}) {
        const target = computed("step")?.target
        if (!target) {
          return
        }
        const ScopedMutationObserver = (
          scope.getWin() as unknown as {
            MutationObserver: typeof MutationObserver
          }
        ).MutationObserver
        const observer = new ScopedMutationObserver(() => {
          const node = target()
          if (node) {
            observer.disconnect()
            send({node, type: "TARGET.RESOLVED"})
          }
        })
        observer.observe(scope.getRootNode(), {
          characterData: true,
          childList: true,
          subtree: true,
        })
        return () => observer.disconnect()
      },
      waitForTargetTimeout({send}) {
        const id = setTimeout(() => send({type: "TARGET.NOT_FOUND"}), 3_000)
        return () => clearTimeout(id)
      },
    },

    guards: {
      hasResolvedTarget: ({context}) => context.get("resolvedTarget") != null,
      hasTarget: ({computed}) => computed("step")?.target != null,
      isLastStep: ({computed, context}) =>
        computed("stepIndex") === context.get("steps").length - 1,
      isTourActive: ({state}) => !state.matches("tourInactive"),
      isValidStep: ({context}) => context.get("stepId") != null,
      isWaitingStep: ({computed}) => computed("step")?.type === "wait",
    },

    ids: ({bindableId}) => ({
      arrow: bindableId(),
      backdrop: bindableId(),
      content: bindableId(),
      description: bindableId(),
      positioner: bindableId(),
      heading: bindableId(),
    }),

    initialState() {
      return "tourInactive"
    },

    on: {
      DISMISS: [
        {
          actions: [
            "cleanupAll",
            "invokeOnDismiss",
            "invokeOnComplete",
            "clearStep",
          ],
          guard: and("isTourActive", "isLastStep"),
          target: "tourInactive",
        },
        {
          actions: ["cleanupAll", "invokeOnDismiss", "clearStep"],
          guard: "isTourActive",
          target: "tourInactive",
        },
      ],
      SKIP: {
        actions: ["cleanupAll", "invokeOnSkip", "clearStep"],
        guard: "isTourActive",
        target: "tourInactive",
      },
      "STEP.CHANGED": [
        {
          actions: ["cleanupStepEffect"],
          guard: and("isValidStep", "hasResolvedTarget"),
          reenter: true,
          target: "running.scrolling",
        },
        {
          actions: ["cleanupStepEffect"],
          guard: and("isValidStep", "hasTarget"),
          reenter: true,
          target: "running.resolving",
        },
        {
          actions: ["cleanupStepEffect"],
          guard: and("isValidStep", "isWaitingStep"),
          reenter: true,
          target: "running.waiting",
        },
        {
          actions: ["cleanupStepEffect"],
          guard: "isValidStep",
          reenter: true,
          target: "running.active",
        },
      ],
      "STEP.NEXT": {actions: ["setNextStep"], guard: "isTourActive"},
      "STEP.PREV": {actions: ["setPrevStep"], guard: "isTourActive"},
      "STEP.ROUTE": [
        {
          guard: and("isValidStep", "hasResolvedTarget"),
          reenter: true,
          target: "running.scrolling",
        },
        {
          guard: and("isValidStep", "hasTarget"),
          reenter: true,
          target: "running.resolving",
        },
        {
          guard: and("isValidStep", "isWaitingStep"),
          reenter: true,
          target: "running.waiting",
        },
        {
          guard: "isValidStep",
          reenter: true,
          target: "running.active",
        },
      ],
      "STEP.SET": {actions: ["setStep"], guard: "isTourActive"},
      "STEPS.SET": {actions: ["setSteps", "validateSteps"]},
    },

    onDestroy: {actions: ["cleanupAll"]},
    onInit: {effects: ["trackBoundarySize"]},

    props({props}) {
      validateTourSteps(props.steps ?? [])
      return {
        closeOnEscape: true,
        closeOnInteractOutside: true,
        dir: "ltr",
        keyboardNavigation: true,
        preventInteraction: false,
        spotlightOffset: {x: 10, y: 10},
        spotlightRadius: 4,
        ...props,
        translations: {
          close: "close tour",
          nextStep: "next step",
          prevStep: "previous step",
          progressText: ({current, total}) => `${current + 1} of ${total}`,
          skip: "skip tour",
          ...props.translations,
        },
      }
    },

    refs() {
      return {
        effectCleanup: undefined,
        internalChange: false,
        previousTarget: undefined,
        targetCleanup: undefined,
      }
    },

    states: {
      "running.active": {
        effects: [
          "trapFocus",
          "trackPlacement",
          "trackDismissableBranch",
          "trackInteractOutside",
          "trackEscapeKeydown",
        ],
        tags: ["open"],
      },
      "running.resolving": {
        effects: ["waitForTarget", "waitForTargetTimeout"],
        on: {
          "TARGET.NOT_FOUND": {
            actions: ["invokeOnNotFound", "clearStep"],
            target: "tourInactive",
          },
          "TARGET.RESOLVED": {
            actions: ["setResolvedTarget"],
            target: "running.scrolling",
          },
        },
        tags: ["closed"],
      },
      "running.scrolling": {
        effects: [
          "waitForScrollEnd",
          "trapFocus",
          "trackPlacement",
          "trackDismissableBranch",
          "trackInteractOutside",
          "trackEscapeKeydown",
        ],
        entry: ["scrollToTarget"],
        on: {
          "SCROLL.END": {target: "running.active"},
        },
        tags: ["open"],
      },
      "running.waiting": {tags: ["closed"]},
      tourInactive: {
        entry: ["validateSteps"],
        on: {
          START: {actions: ["setInitialStep", "invokeOnStart"]},
        },
        tags: ["closed"],
      },
    },

    watch({context, refs, send, track}) {
      track([() => context.get("stepId")], () => {
        if (refs.get("internalChange")) {
          refs.set("internalChange", false)
          return
        }
        const step = findStep(context.get("steps"), context.get("stepId"))
        context.set("resolvedTarget", step?.target?.() ?? null)
        syncTargetAttributes({context, refs})
        queueMicrotask(() => send({type: "STEP.CHANGED"}))
      })
    },
  })

function syncTargetAttributes({
  context,
  prop,
  refs,
}: Pick<Params<TourSchema>, "context" | "refs"> &
  Partial<Pick<Params<TourSchema>, "prop">>): void {
  const target = context.get("resolvedTarget")
  const previousTarget = refs.get("previousTarget")
  if (target !== previousTarget) {
    refs.get("targetCleanup")?.()
    refs.set("targetCleanup", undefined)
  }
  if (!target) {
    refs.set("previousTarget", null)
    return
  }
  if (target === previousTarget) {
    return
  }
  if (prop?.("preventInteraction")) {
    target.inert = true
  }
  target.setAttribute("data-tour-highlighted", "")
  refs.set("targetCleanup", () => {
    if (prop?.("preventInteraction")) {
      target.inert = false
    }
    target.removeAttribute("data-tour-highlighted")
  })
  refs.set("previousTarget", target)
}

function performStepTransition(params: Params<TourSchema>, index: number): void {
  const {context, refs, send} = params
  const step = context.get("steps")[index]
  if (!step) {
    refs.set("internalChange", true)
    context.set("stepId", null)
    return
  }
  if (isEqual(context.get("stepId"), step.id)) {
    return
  }
  refs.get("effectCleanup")?.()
  refs.set("effectCleanup", undefined)
  refs.get("targetCleanup")?.()
  refs.set("targetCleanup", undefined)
  if (step.effect) {
    executeStepEffect(params, step, index)
    return
  }
  context.set("resolvedTarget", step.target?.() ?? null)
  refs.set("internalChange", true)
  context.set("stepId", step.id)
  syncTargetAttributes(params)
  send({type: "STEP.ROUTE"})
}

function createEffectUtilities(
  params: Params<TourSchema>,
  step: TourStepDetails,
  index: number,
): TourStepEffectArgs {
  const {context, prop, refs, send} = params
  const steps = context.get("steps")
  return {
    dismiss() {
      refs.get("effectCleanup")?.()
      refs.set("effectCleanup", undefined)
      refs.set("internalChange", true)
      context.set("stepId", null)
      prop("onStatusChange")?.({
        status: "dismissed",
        stepId: null,
        stepIndex: -1,
      })
    },
    goto(id) {
      const targetIndex = findStepIndex(steps, id)
      if (targetIndex === -1) {
        warn(`[@qualcomm-ui/core/tour] Step with id "${id}" not found`)
        return
      }
      performStepTransition(params, targetIndex)
    },
    next() {
      performStepTransition(params, nextIndex(steps, index))
    },
    show() {
      context.set("resolvedTarget", step.target?.() ?? null)
      refs.set("internalChange", true)
      context.set("stepId", step.id)
      syncTargetAttributes(params)
      send({type: "STEP.ROUTE"})
    },
    target: step.target,
    update(data) {
      context.set("steps", (current) =>
        current.map((item, itemIndex) =>
          itemIndex === index ? {...item, ...data} : item,
        ),
      )
    },
  }
}

function executeStepEffect(
  params: Params<TourSchema>,
  step: TourStepDetails,
  index: number,
): void {
  const utilities = createEffectUtilities(params, step, index)
  let cleanup: TourStepEffectCleanup | undefined
  try {
    cleanup = step.effect?.(utilities)
  } catch (error) {
    console.error(error)
    return
  }
  params.refs.set("effectCleanup", cleanup)
  if (isWaitStep(step)) {
    utilities.show()
  }
}
