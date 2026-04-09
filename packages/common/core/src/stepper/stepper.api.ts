// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {fromLength} from "@qualcomm-ui/utils/array"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {domIds, isValidStepNavigation} from "./internal"
import type {
  StepperApi,
  StepperCompletedContentBindings,
  StepperContentBindings,
  StepperHintBindings,
  StepperIndicatorBindings,
  StepperItemBindings,
  StepperItemProps,
  StepperItemState,
  StepperLabelBindings,
  StepperListBindings,
  StepperNextTriggerBindings,
  StepperPrevTriggerBindings,
  StepperRootBindings,
  StepperSchema,
  StepperSeparatorBindings,
  StepperTriggerBindings,
} from "./stepper.types"

export function createStepperApi(
  machine: Machine<StepperSchema>,
  normalize: PropNormalizer,
): StepperApi {
  const {computed, context, prop, scope, send} = machine

  const step = context.get("step")
  const count = prop("count")
  const visited = context.get("visited")
  const hasNextStep = computed("hasNextStep")
  const hasPrevStep = computed("hasPrevStep")

  const isStepSkippable = (index: number): boolean => {
    return prop("isStepSkippable")?.(index) ?? false
  }

  const getItemState = (props: StepperItemProps): StepperItemState => {
    const completedOverride = prop("completed")?.[props.index]
    const completed =
      completedOverride ?? (prop("linear") ? props.index < step : false)
    const pending = prop("pending")?.[props.index] ?? false
    return {
      completed,
      contentId: domIds.content(scope, `${props.index}`)!,
      current: props.index === step,
      first: props.index === 0,
      incomplete: !completed,
      index: props.index,
      invalid: prop("invalid")?.[props.index] ?? false,
      last: props.index === count - 1,
      pending,
      previous: props.index < step,
      skippable: isStepSkippable(props.index),
      triggerId: domIds.trigger(scope, `${props.index}`)!,
      visited: visited[props.index] ?? false,
    }
  }

  const goToNextStep = () => {
    send({src: "next.trigger.click", type: "STEP.NEXT", value: step + 1})
  }

  const goToPrevStep = () => {
    send({src: "prev.trigger.click", type: "STEP.PREV"})
  }

  const resetStep = () => {
    send({src: "reset.trigger.click", type: "STEP.RESET"})
  }

  const setStep = (value: number) => {
    send({src: "api.setValue", type: "STEP.SET", value})
  }

  const commonBindings = {
    dir: prop("dir"),
    scope: "stepper",
  } as const

  return {
    count,
    getItemState,
    goToNextStep,
    goToPrevStep,
    hasNextStep,
    hasPrevStep,
    isStepSkippable,
    resetStep,
    setStep,
    step,

    // group: bindings
    getCompletedContentBindings(): StepperCompletedContentBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "completed-content",
        hidden: computed("hasNextStep"),
      })
    },

    getContentBindings(props): StepperContentBindings {
      scope.ids
        .collection("content")
        .register(`${props.index}`, props.id, props.onDestroy)
      const itemState = getItemState(props)
      return normalize.element({
        ...commonBindings,
        "aria-labelledby": itemState.triggerId,
        "data-orientation": prop("orientation"),
        "data-part": "content",
        "data-state": itemState.current ? "open" : "closed",
        hidden: !itemState.current,
        id: itemState.contentId,
        role: "tabpanel",
        tabIndex: 0,
      })
    },

    getHintBindings(props): StepperHintBindings {
      const itemState = getItemState(props)
      return normalize.element({
        ...commonBindings,
        "data-complete": booleanDataAttr(itemState.completed),
        "data-current": booleanDataAttr(itemState.current),
        "data-incomplete": booleanDataAttr(itemState.incomplete),
        "data-orientation": prop("orientation"),
        "data-part": "hint",
      })
    },

    getIndicatorBindings(props): StepperIndicatorBindings {
      const itemState = getItemState(props)
      return normalize.element({
        ...commonBindings,
        "aria-hidden": true,
        "data-complete": booleanDataAttr(itemState.completed),
        "data-current": booleanDataAttr(itemState.current),
        "data-incomplete": booleanDataAttr(itemState.incomplete),
        "data-orientation": prop("orientation"),
        "data-part": "indicator",
        style: {
          "--anchor-name": `--indicator-${props.index}`,
        },
      })
    },

    getItemBindings(props): StepperItemBindings {
      const itemState = getItemState(props)
      return normalize.element({
        ...commonBindings,
        "data-current": booleanDataAttr(itemState.current),
        "data-first": booleanDataAttr(itemState.first),
        "data-last": booleanDataAttr(itemState.last),
        "data-orientation": prop("orientation"),
        "data-part": "item",
        "data-previous": booleanDataAttr(itemState.previous),
        "data-skippable": booleanDataAttr(itemState.skippable),
        role: "none",
      })
    },

    getLabelBindings(props): StepperLabelBindings {
      const itemState = getItemState(props)
      return normalize.element({
        ...commonBindings,
        "data-complete": booleanDataAttr(itemState.completed),
        "data-current": booleanDataAttr(itemState.current),
        "data-incomplete": booleanDataAttr(itemState.incomplete),
        "data-orientation": prop("orientation"),
        "data-part": "label",
      })
    },

    getListBindings(params): StepperListBindings {
      scope.ids.register("list", params)
      const arr = fromLength(count)
      const triggerIds = arr.map((_, index) =>
        domIds.trigger(scope, `${index}`),
      )
      return normalize.element({
        ...commonBindings,
        "aria-orientation": prop("orientation").split?.("-")[0] as
          | "horizontal"
          | "vertical",
        "aria-owns": triggerIds.join(" "),
        "data-orientation": prop("orientation"),
        "data-part": "list",
        id: domIds.list(scope),
        role: "tablist",
      })
    },

    getNextTriggerBindings(): StepperNextTriggerBindings {
      return normalize.button({
        ...commonBindings,
        "data-disabled": booleanDataAttr(!hasNextStep),
        "data-part": "next-trigger",
        disabled: !hasNextStep,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          goToNextStep()
        },
        type: "button",
      })
    },

    getPrevTriggerBindings(): StepperPrevTriggerBindings {
      return normalize.button({
        ...commonBindings,
        "data-disabled": booleanDataAttr(!hasPrevStep),
        "data-part": "prev-trigger",
        disabled: !hasPrevStep,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          goToPrevStep()
        },
        type: "button",
      })
    },

    getRootBindings(params): StepperRootBindings {
      scope.ids.register("root", params)
      return normalize.element({
        ...commonBindings,
        "data-orientation": prop("orientation"),
        "data-part": "root",
        id: domIds.root(scope),
      })
    },

    getSeparatorBindings(props): StepperSeparatorBindings {
      const itemState = getItemState(props)
      return normalize.element({
        ...commonBindings,
        "data-complete": booleanDataAttr(itemState.completed),
        "data-incomplete": booleanDataAttr(itemState.incomplete),
        "data-orientation": prop("orientation"),
        "data-part": "separator",
        style: {
          "--current-indicator": `--indicator-${props.index}`,
          "--next-indicator": `--indicator-${props.index + 1}`,
        },
      })
    },

    getTriggerBindings(props): StepperTriggerBindings {
      scope.ids
        .collection("trigger")
        .register(`${props.index}`, props.id, props.onDestroy)
      const itemState = getItemState(props)
      return normalize.button({
        ...commonBindings,
        "aria-controls": itemState.contentId,
        "aria-current": itemState.current ? "step" : undefined,
        "aria-disabled": booleanAriaAttr(
          !isValidStepNavigation({
            canGoToStep: prop("canGoToStep"),
            current: step,
            isStepSkippable: prop("isStepSkippable"),
            linear: prop("linear"),
            targetStep: props.index,
            visited,
          }),
          null,
        ),
        "aria-selected": itemState.current,
        "data-complete": booleanDataAttr(itemState.completed),
        "data-current": booleanDataAttr(itemState.current),
        "data-incomplete": booleanDataAttr(itemState.incomplete),
        "data-invalid": booleanDataAttr(itemState.invalid),
        "data-last": booleanDataAttr(itemState.last),
        "data-orientation": prop("orientation"),
        "data-part": "trigger",
        "data-pending": booleanDataAttr(itemState.pending),
        "data-state": itemState.current ? "open" : "closed",
        id: itemState.triggerId,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({src: "trigger.click", type: "STEP.SET", value: props.index})
        },
        role: "tab",
        tabIndex: !prop("linear") || itemState.current ? 0 : -1,
      })
    },
  }
}
