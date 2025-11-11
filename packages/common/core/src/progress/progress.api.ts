import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {domIds} from "./internal"
import type {
  ProgressApi,
  ProgressBarBindings,
  ProgressCommonBindings,
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
} from "./progress.types"

export function createProgressApi(
  store: Machine<ProgressSchema>,
  normalize: PropNormalizer,
): ProgressApi {
  const {computed, context, prop, scope, send} = store

  const commonBindings: ProgressCommonBindings = {
    "data-scope": "progress",
    dir: prop("dir"),
  }

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
      ...commonBindings,
      "data-invalid": booleanDataAttr(prop("invalid")),
      "data-max": max,
      "data-part": "root",
      "data-state": state,
      "data-value": value ?? undefined,
      style: {
        "--percent": `${computed("valuePercent")}%`,
      },
    })
  }

  function getTrackBindings(): Omit<ProgressTrackBindings, "id"> {
    const ariaLabelledby = domIds.label(scope)
    return {
      ...commonBindings,
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
      "data-part": "track",
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
        ...commonBindings,
        "data-invalid": booleanDataAttr(prop("invalid")),
        "data-max": max,
        "data-part": "bar",
        "data-state": state,
        style: {
          "--percent": `${computed("valuePercent")}%`,
        },
      })
    },
    getErrorTextBindings(
      props: IdRegistrationProps,
    ): ProgressErrorTextBindings {
      scope.ids.register("errorText", props)
      return normalize.element({
        ...commonBindings,
        "aria-live": "polite",
        "data-part": "error-text",
        hidden: !prop("invalid"),
        id: domIds.errorText(scope),
      })
    },
    getHintBindings(props: IdRegistrationProps): ProgressHintBindings {
      scope.ids.register("hint", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "hint",
        id: domIds.hint(scope),
      })
    },
    getLabelBindings(props): ProgressLabelBindings {
      scope.ids.register("label", props)

      return normalize.element({
        ...commonBindings,
        "data-part": "label",
        id: domIds.label(scope),
      })
    },
    getRingBarBindings(): ProgressRingBarBindings {
      return normalize.element({
        ...commonBindings,
        "data-invalid": booleanDataAttr(prop("invalid")),
        "data-max": max,
        "data-part": "circle-bar",
        "data-state": state,
        style: {
          "--percent": `${computed("valuePercent")}%`,
          "--progress": context.get("value"),
        },
      })
    },
    getRingCircleBindings(
      props: IdRegistrationProps,
    ): ProgressRingCircleBindings {
      scope.ids.register("progress", props)
      return normalize.element({
        ...getTrackBindings(),
        "data-part": "circle",
        id: domIds.progress(scope),
      })
    },
    getRingRootBindings(): ProgressRingRootBindings {
      return getRootBindings()
    },
    getRingTrackBindings(): ProgressRingTrackBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "circle-track",
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
        ...commonBindings,
        "aria-live": "polite",
        "data-invalid": booleanDataAttr(prop("invalid")),
        "data-part": "value-text",
      })
    },
  }
}
