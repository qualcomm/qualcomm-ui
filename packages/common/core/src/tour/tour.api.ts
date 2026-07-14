// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getPlacementStyles} from "@qualcomm-ui/dom/floating-ui"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"
import {toPx} from "@qualcomm-ui/utils/number"

import {domIds} from "./internal/tour.dom.js"
import {tourAnatomy} from "./tour.anatomy.js"
import type {
  TourActionTriggerBindings,
  TourApi,
  TourArrowBindings,
  TourArrowTipBindings,
  TourBackdropBindings,
  TourCloseTriggerBindings,
  TourContentBindings,
  TourDescriptionBindings,
  TourPositionerBindings,
  TourProgressTextBindings,
  TourSchema,
  TourSpotlightBindings,
  TourStepActionMap,
  TourHeadingBindings,
} from "./tour.types.js"
import {getClipPath} from "./utils/clip-path.js"
import {
  getEffectiveStepIndex,
  getEffectiveSteps,
  isDialogStep,
  isTooltipPlacement,
  isTooltipStep,
} from "./utils/step.js"

const parts = tourAnatomy.parts

export function createTourApi(
  machine: Machine<TourSchema>,
  normalize: PropNormalizer,
): TourApi {
  const {computed, context, prop, scope, send, state} = machine
  const open = state.hasTag("open")
  const steps = Array.from(context.get("steps"))
  const stepIndex = computed("stepIndex")
  const step = computed("step")
  const hasTarget = step?.target?.() != null
  const hasNextStep = computed("hasNextStep")
  const hasPrevStep = computed("hasPrevStep")
  const placement = context.get("currentPlacement")
  const targetRect = context.get("targetRect")

  const placementStyles = getPlacementStyles({
    placement: isTooltipPlacement(placement) ? placement : undefined,
    strategy: "absolute",
  })
  const clipPath = getClipPath({
    enabled: isTooltipStep(step),
    radius: prop("spotlightRadius"),
    rect: targetRect,
    rootSize: context.get("boundarySize"),
  })

  const actionMap: TourStepActionMap = {
    dismiss() {
      send({src: "actionTrigger", type: "DISMISS"})
    },
    goto(id) {
      send({src: "actionTrigger", type: "STEP.SET", value: id})
    },
    next() {
      send({src: "actionTrigger", type: "STEP.NEXT"})
    },
    prev() {
      send({src: "actionTrigger", type: "STEP.PREV"})
    },
    skip() {
      send({src: "actionTrigger", type: "SKIP"})
    },
  }

  return {
    addStep(step) {
      send({src: "addStep", type: "STEPS.SET", value: steps.concat(step)})
    },
    firstStep: computed("isFirstStep"),
    getActionTriggerBindings(action): TourActionTriggerBindings {
      let actionBindings: Omit<
        TourActionTriggerBindings,
        "data-tour-part" | "type"
      >
      switch (action.action) {
        case "next":
          actionBindings = {
            "aria-label": prop("translations").nextStep,
            "data-disabled": booleanDataAttr(!hasNextStep),
            "data-type": "next",
            disabled: !hasNextStep,
            onClick: actionMap.next,
          }
          break
        case "prev":
          actionBindings = {
            "aria-label": prop("translations").prevStep,
            "data-disabled": booleanDataAttr(!hasPrevStep),
            "data-type": "prev",
            disabled: !hasPrevStep,
            onClick: actionMap.prev,
          }
          break
        case "dismiss":
          actionBindings = {
            "aria-label": prop("translations").close,
            "data-type": "close",
            onClick: actionMap.dismiss,
          }
          break
        case "skip":
          actionBindings = {
            "aria-label": prop("translations").skip,
            "data-type": "skip",
            onClick: actionMap.skip,
          }
          break
        default:
          actionBindings = {
            "data-type": "custom",
            onClick() {
              if (typeof action.action === "function") {
                action.action(actionMap)
              }
            },
          }
      }
      return normalize.button({
        ...parts.actionTrigger,
        ...action.attrs,
        ...actionBindings,
        type: "button",
      })
    },
    getArrowBindings(props): TourArrowBindings {
      scope.ids.register("arrow", props)
      return normalize.element({
        ...parts.arrow,
        dir: prop("dir"),
        hidden: step?.type !== "tooltip",
        id: props.id,
        opacity: hasTarget ? undefined : 0,
        style: step?.type === "tooltip" ? placementStyles.arrow : undefined,
      })
    },
    getArrowTipBindings(): TourArrowTipBindings {
      return normalize.element({
        ...parts.arrowTip,
        dir: prop("dir"),
        style: placementStyles.arrowTip,
      })
    },
    getBackdropBindings(props): TourBackdropBindings {
      scope.ids.register("backdrop", props)
      return normalize.element({
        ...parts.backdrop,
        "data-state": open ? "open" : "closed",
        "data-type": step?.type,
        dir: prop("dir"),
        hidden: !open,
        id: props.id,
        style: {
          "--tour-layer": 0,
          clipPath: isTooltipStep(step) ? `path("${clipPath}")` : undefined,
          inset: "0",
          position: isDialogStep(step) ? "fixed" : "absolute",
          willChange: isTooltipStep(step) ? "clip-path" : undefined,
        },
      })
    },
    getCloseTriggerBindings(): TourCloseTriggerBindings {
      return normalize.button({
        ...parts.closeTrigger,
        "aria-label": prop("translations").close,
        "data-type": step?.type,
        onClick: actionMap.dismiss,
        type: "button",
      })
    },
    getContentBindings(props): TourContentBindings {
      scope.ids.register("content", props)
      return normalize.element({
        ...parts.content,
        "aria-atomic": true,
        "aria-describedby": domIds.description(scope),
        "aria-labelledby": domIds.heading(scope),
        "aria-live": "polite",
        "aria-modal": true,
        "data-placement": placement,
        "data-state": open ? "open" : "closed",
        "data-step": step?.id,
        "data-type": step?.type,
        dir: prop("dir"),
        hidden: !open,
        id: props.id,
        onKeyDown(event) {
          if (event.defaultPrevented || !prop("keyboardNavigation")) {
            return
          }
          const rtl = prop("dir") === "rtl"
          if (
            event.key === "ArrowRight" &&
            (rtl ? hasPrevStep : hasNextStep)
          ) {
            send({src: "keydown", type: rtl ? "STEP.PREV" : "STEP.NEXT"})
          } else if (
            event.key === "ArrowLeft" &&
            (rtl ? hasNextStep : hasPrevStep)
          ) {
            send({src: "keydown", type: rtl ? "STEP.NEXT" : "STEP.PREV"})
          }
        },
        role: "alertdialog",
        tabIndex: -1,
      })
    },
    getDescriptionBindings(props): TourDescriptionBindings {
      scope.ids.register("description", props)
      return normalize.element({
        ...parts.description,
        "data-placement": hasTarget ? placement : "center",
        id: props.id,
      })
    },
    getPositionerBindings(props): TourPositionerBindings {
      scope.ids.register("positioner", props)
      return normalize.element({
        ...parts.positioner,
        "data-placement": placement,
        "data-type": step?.type,
        dir: prop("dir"),
        id: props.id,
        style: {
          "--tour-layer": 2,
          ...(step?.type === "tooltip" ? placementStyles.floating : {}),
        },
      })
    },
    getProgressPercent() {
      const index = getEffectiveStepIndex(steps, step?.id)
      return ((index + 1) / getEffectiveSteps(steps).length) * 100
    },
    getProgressText() {
      const current = getEffectiveStepIndex(steps, step?.id)
      const total = getEffectiveSteps(steps).length
      return prop("translations").progressText?.({current, total}) ?? ""
    },
    getProgressTextBindings(): TourProgressTextBindings {
      return normalize.element({...parts.progressText})
    },
    getSpotlightBindings(): TourSpotlightBindings {
      return normalize.element({
        ...parts.spotlight,
        hidden: !open || !hasTarget,
        style: {
          "--tour-layer": 1,
          borderRadius: toPx(prop("spotlightRadius")),
          height: toPx(targetRect.height),
          left: toPx(targetRect.x),
          pointerEvents: "none",
          position: "absolute",
          top: toPx(targetRect.y),
          width: toPx(targetRect.width),
        },
      })
    },
    getHeadingBindings(props): TourHeadingBindings {
      scope.ids.register("heading", props)
      return normalize.element({
        ...parts.heading,
        "data-placement": hasTarget ? placement : "center",
        id: props.id,
      })
    },
    hasNextStep,
    hasPrevStep,
    isCurrentStep(id) {
      return step?.id === id
    },
    isValidStep(id) {
      return steps.some((item) => item.id === id)
    },
    lastStep: computed("isLastStep"),
    next() {
      send({type: "STEP.NEXT"})
    },
    open,
    prev() {
      send({type: "STEP.PREV"})
    },
    removeStep(id) {
      send({
        src: "removeStep",
        type: "STEPS.SET",
        value: steps.filter((item) => item.id !== id),
      })
    },
    setStep(id) {
      send({type: "STEP.SET", value: id})
    },
    setSteps(value) {
      send({src: "setSteps", type: "STEPS.SET", value})
    },
    start(id) {
      send({type: "START", value: id})
    },
    step,
    stepIndex,
    totalSteps: steps.length,
    updateStep(id, stepOverrides) {
      send({
        src: "updateStep",
        type: "STEPS.SET",
        value: steps.map((item) =>
          item.id === id ? mergeProps(item, stepOverrides) : item,
        ),
      })
    },
  }
}
