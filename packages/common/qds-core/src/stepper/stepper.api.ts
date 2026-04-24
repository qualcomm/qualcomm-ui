// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {stepperClasses} from "./stepper.classes"
import type {
  QdsStepperApi,
  QdsStepperApiProps,
  QdsStepperCompletedContentBindings,
  QdsStepperContentBindings,
  QdsStepperHintBindings,
  QdsStepperIndicatorBindings,
  QdsStepperIndicatorIconBindings,
  QdsStepperItemBindings,
  QdsStepperLabelBindings,
  QdsStepperListBindings,
  QdsStepperNextTriggerBindings,
  QdsStepperPrevTriggerBindings,
  QdsStepperRootBindings,
  QdsStepperSeparatorBindings,
  QdsStepperTriggerBindings,
} from "./stepper.types"

export function createQdsStepperApi(
  props: QdsStepperApiProps,
  normalize: PropNormalizer,
): QdsStepperApi {
  const size = props.size || "lg"

  return {
    size,

    // group: bindings
    getCompletedContentBindings(): QdsStepperCompletedContentBindings {
      return normalize.element({
        className: stepperClasses.completedContent,
        "data-size": size,
      })
    },
    getContentBindings(): QdsStepperContentBindings {
      return normalize.element({
        className: stepperClasses.content,
        "data-size": size,
      })
    },
    getHintBindings(): QdsStepperHintBindings {
      return normalize.element({
        className: stepperClasses.hint,
        "data-size": size,
      })
    },
    getIndicatorBindings(): QdsStepperIndicatorBindings {
      return normalize.element({
        className: stepperClasses.indicator,
        "data-size": size,
      })
    },
    getIndicatorIconBindings(): QdsStepperIndicatorIconBindings {
      return normalize.element({
        className: stepperClasses.indicatorIcon,
        "data-size": size,
      })
    },
    getItemBindings(): QdsStepperItemBindings {
      return normalize.element({
        className: stepperClasses.item,
        "data-size": size,
      })
    },
    getLabelBindings(): QdsStepperLabelBindings {
      return normalize.label({
        className: stepperClasses.label,
        "data-size": size,
      })
    },
    getListBindings(): QdsStepperListBindings {
      return normalize.element({
        className: stepperClasses.list,
        "data-size": size,
      })
    },
    getNextTriggerBindings(): QdsStepperNextTriggerBindings {
      return normalize.element({
        className: stepperClasses.nextTrigger,
      })
    },
    getPrevTriggerBindings(): QdsStepperPrevTriggerBindings {
      return normalize.element({
        className: stepperClasses.prevTrigger,
      })
    },
    getRootBindings(): QdsStepperRootBindings {
      return normalize.element({
        className: stepperClasses.root,
        "data-size": size,
      })
    },
    getSeparatorBindings(): QdsStepperSeparatorBindings {
      return normalize.element({
        className: stepperClasses.separator,
        "data-size": size,
      })
    },
    getTriggerBindings(): QdsStepperTriggerBindings {
      return normalize.element({
        className: stepperClasses.trigger,
        "data-size": size,
      })
    },
  }
}
