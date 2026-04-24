// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"
import {isValueWithinRange} from "@qualcomm-ui/utils/number"
import {maybeAccess} from "@qualcomm-ui/utils/object"

import {isValidStepNavigation} from "./internal"
import type {StepperSchema} from "./stepper.types"

const stepperMachineBase = {
  computed: {
    hasNextStep: ({context, prop}) => context.get("step") < prop("count"),
    hasPrevStep: ({context}) => context.get("step") > 0,
  },

  context({bindable, prop}) {
    return {
      step: bindable<number>(() => ({
        defaultValue: prop("defaultStep"),
        onChange(value) {
          prop("onStepChange")?.(value)
        },
        value: prop("step"),
      })),
      visited: bindable<Record<number, boolean>>(() => ({
        defaultValue: {[prop("defaultStep")]: true},
      })),
    }
  },

  ids: ({bindableId, bindableIdCollection}) => {
    return {
      content: bindableIdCollection(),
      list: bindableId(),
      root: bindableId(),
      trigger: bindableIdCollection(),
    }
  },

  initialState() {
    return "idle"
  },

  on: {
    "STEP.NEXT": [
      {
        actions: ["goToNextStep"],
        guard: "isValidStepNavigation",
      },
      {
        actions: ["invokeOnStepInvalid"],
      },
    ],
    "STEP.PREV": {
      actions: ["goToPrevStep"],
    },
    "STEP.RESET": {
      actions: ["resetStep"],
    },
    "STEP.SET": [
      {
        actions: ["setStep"],
        guard: "isValidStepNavigation",
      },
      {
        actions: ["invokeOnStepInvalid"],
      },
    ],
  },

  onInit: {
    actions: ["validateStepIndex"],
  },

  props({props}) {
    return {
      count: 1,
      defaultStep: 0,
      dir: "ltr",
      linear: true,
      orientation: "horizontal",
      ...props,
    }
  },

  states: {
    idle: {},
  },
} satisfies MachineConfigBase<StepperSchema>

export const stepperMachine: MachineConfig<StepperSchema> =
  createNarrowedMachine<StepperSchema>()(stepperMachineBase, {
    actions: {
      goToNextStep({context, prop}) {
        const count = prop("count")
        const next = Math.min(context.get("step") + 1, count)
        context.set("step", next)
        context.set("visited", (prev) => ({...prev, [next]: true}))
      },
      goToPrevStep({context}) {
        const next = Math.max(context.get("step") - 1, 0)
        context.set("step", next)
        context.set("visited", (prev) => ({...prev, [next]: true}))
      },
      invokeOnStepInvalid({context, event, prop}) {
        prop("onStepInvalid")?.({
          action: event.type === "STEP.NEXT" ? "next" : "set",
          step: context.get("step"),
          targetStep: maybeAccess(event, "value"),
        })
      },
      resetStep({context}) {
        context.set("step", 0)
        context.set("visited", {0: true})
      },
      setStep({context, event}) {
        const next = event.value
        context.set("step", next)
        context.set("visited", (prev) => ({...prev, [next]: true}))
      },
      validateStepIndex({context, prop}) {
        validateStepIndex(prop("count"), context.get("step"))
      },
    },
    guards: {
      isValidStepNavigation({context, event, prop}) {
        const targetStep = maybeAccess(event, "value")
        if (targetStep === null || targetStep === undefined) {
          return false
        }
        return isValidStepNavigation({
          canGoToStep: prop("canGoToStep"),
          current: context.get("step"),
          isStepSkippable: prop("isStepSkippable"),
          linear: prop("linear"),
          targetStep,
          visited: context.get("visited"),
        })
      },
    },
  })

function validateStepIndex(count: number, step: number) {
  if (!isValueWithinRange(step, 0, count)) {
    throw new RangeError(
      `[@qualcomm-ui/core/stepper] step index ${step} is out of bounds`,
    )
  }
}
