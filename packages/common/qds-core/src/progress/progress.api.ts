// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {progressClasses} from "./progress.classes"
import type {
  QdsProgressApi,
  QdsProgressApiProps,
  QdsProgressBarBindings,
  QdsProgressErrorTextBindings,
  QdsProgressHintBindings,
  QdsProgressLabelBindings,
  QdsProgressRootBindings,
  QdsProgressTrackBindings,
  QdsProgressValueTextBindings,
} from "./progress.types"

export function createQdsProgressApi(
  props: QdsProgressApiProps,
  normalize: PropNormalizer,
): QdsProgressApi {
  const emphasis = props.emphasis || "primary"
  const labelOrientation = props.labelOrientation || "top"
  const size = props.size || "md"

  return {
    size,
    // group: bindings
    getBarBindings(): QdsProgressBarBindings {
      return normalize.element({
        className: progressClasses.bar,
        "data-emphasis": emphasis,
        "data-size": size,
      })
    },
    getErrorTextBindings(): QdsProgressErrorTextBindings {
      return normalize.element({
        className: progressClasses.errorText,
      })
    },
    getHintBindings(): QdsProgressHintBindings {
      return normalize.element({
        className: progressClasses.hint,
      })
    },
    getLabelBindings(): QdsProgressLabelBindings {
      return normalize.label({
        className: progressClasses.label,
      })
    },
    getRootBindings(): QdsProgressRootBindings {
      return normalize.element({
        className: progressClasses.root,
        "data-label-orientation": labelOrientation,
        "data-size": size,
      })
    },
    getTrackBindings(): QdsProgressTrackBindings {
      return normalize.element({
        className: progressClasses.track,
        "data-size": size,
      })
    },
    getValueTextBindings(): QdsProgressValueTextBindings {
      return normalize.element({
        className: progressClasses.valueText,
      })
    },
  }
}
