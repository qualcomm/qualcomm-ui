// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal/index.js"
import {progressAnatomy} from "./progress.anatomy.js"
import type {
  ProgressApi,
  ProgressBarBindings,
  ProgressErrorTextBindings,
  ProgressHintBindings,
  ProgressLabelBindings,
  ProgressRingBarBindings,
  ProgressRingCircleBindings,
  ProgressRingRootBindings,
  ProgressRingTrackBindings,
  ProgressRootBindings,
  ProgressSchema,
  ProgressTrackBindings,
  ProgressValueTextBindings,
} from "./progress.types.js"

const parts = progressAnatomy.parts

export function createProgressApi(
  store: Machine<ProgressSchema>,
  normalize: PropNormalizer,
): ProgressApi {
  const {computed, context, prop, scope, send} = store

  const value = context.get("value")
  const min = prop("min")
  const max = prop("max")
  const state = computed("state")

  function getAriaDescribedby() {
    const ids: string[] = []
    const hint = domIds.hint(scope)
    if (hint) {
      ids.push(hint)
    }
    if (prop("invalid") && domIds.errorText(scope)) {
      ids.push(domIds.errorText(scope))
    }
    return ids.join(" ") || undefined
  }

  function getRootBindings(): ProgressRootBindings {
    const value = context.get("value")
    return normalize.element({
      ...parts.root,
      "data-disabled": booleanDataAttr(prop("disabled")),
      "data-invalid": booleanDataAttr(prop("invalid")),
      "data-max": max,
      "data-state": state,
      "data-value": value ?? undefined,
      dir: prop("dir"),
      style: {
        "--percent": computed("valuePercent"),
      },
    })
  }

  function getTrackBindings(): Omit<ProgressTrackBindings, "id"> {
    const ariaLabelledby = domIds.label(scope)
    return {
      ...parts.track,
      "aria-describedby": getAriaDescribedby(),
      "aria-label":
        typeof value === "number"
          ? `${value}`
          : ariaLabelledby
            ? undefined
            : "Loading",
      "aria-labelledby": ariaLabelledby || undefined,
      "aria-valuemax": max,
      "aria-valuemin": min,
      "aria-valuenow": value ?? undefined,
      "data-disabled": booleanDataAttr(prop("disabled")),
      "data-state": state,
      role: "progressbar",
    }
  }

  return {
    isIndeterminate: computed("isIndeterminate"),
    max,
    min,
    setValue: (value) => send({type: "SET_VALUE", value}),
    state,
    value,
    valuePercent: computed("valuePercent"),

    // group: bindings
    getBarBindings(): ProgressBarBindings {
      return normalize.element({
        ...parts.bar,
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-invalid": booleanDataAttr(prop("invalid")),
        "data-max": max,
        "data-state": state,
      })
    },
    getErrorTextBindings(
      props: IdRegistrationProps,
    ): ProgressErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...parts.errorText,
        "aria-live": "polite",
        hidden: !prop("invalid"),
        id: domIds.errorText(scope),
      })
    },
    getHintBindings(props: IdRegistrationProps): ProgressHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...parts.hint,
        hidden: !!prop("invalid"),
        id: domIds.hint(scope),
      })
    },
    getLabelBindings(props): ProgressLabelBindings {
      scope.ids.register("label", props)

      return normalize.element({
        ...parts.label,
        id: domIds.label(scope),
      })
    },
    getRingBarBindings(): ProgressRingBarBindings {
      return normalize.element({
        ...parts.circleBar,
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-invalid": booleanDataAttr(prop("invalid")),
        "data-max": max,
        "data-state": state,
      })
    },
    getRingCircleBindings(
      props: IdRegistrationProps,
    ): ProgressRingCircleBindings {
      scope.ids.register("progress", props)
      return normalize.element({
        ...getTrackBindings(),
        ...parts.circle,
        id: domIds.progress(scope),
      })
    },
    getRingRootBindings(): ProgressRingRootBindings {
      return getRootBindings()
    },
    getRingTrackBindings(): ProgressRingTrackBindings {
      return normalize.element({
        ...parts.circleTrack,
        "data-disabled": booleanDataAttr(prop("disabled")),
        "data-state": state,
      })
    },
    getRootBindings,
    getTrackBindings: (props) => {
      scope.ids.register("progress", props)
      return normalize.element({...getTrackBindings(), id: props.id})
    },
    getValueTextBindings(): ProgressValueTextBindings {
      return normalize.element({
        ...parts.valueText,
        "aria-live": "polite",
        "data-invalid": booleanDataAttr(prop("invalid")),
      })
    },
  }
}
