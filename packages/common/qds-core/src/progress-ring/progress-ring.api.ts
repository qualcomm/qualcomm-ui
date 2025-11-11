// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {JSX, PropNormalizer} from "@qualcomm-ui/utils/machine"

import {progressRingClasses} from "./progress-ring.classes"
import type {
  QdsProgressRingApi,
  QdsProgressRingApiProps,
  QdsProgressRingBarBindings,
  QdsProgressRingCircleBindings,
  QdsProgressRingCircleContainerBindings,
  QdsProgressRingErrorTextBindings,
  QdsProgressRingLabelBindings,
  QdsProgressRingRootBindings,
  QdsProgressRingTrackBindings,
  QdsProgressRingValueTextBindings,
} from "./progress-ring.types"

export function createQdsProgressRingApi(
  props: QdsProgressRingApiProps,
  normalize: PropNormalizer,
): QdsProgressRingApi {
  const emphasis = props.emphasis || "primary"
  const size = props.size || "md"
  const thickness = props.thickness
  const circleStyle: JSX.CSSProperties = {}
  if (typeof size === "number") {
    circleStyle["--size-override"] = `${size}px`
  }
  if (typeof thickness === "number") {
    circleStyle["--thickness-override"] = `${thickness}px`
  } else if (typeof thickness === "string") {
    circleStyle["--thickness-override"] = thickness
  }

  return {
    size,

    // group: bindings
    getBarBindings(): QdsProgressRingBarBindings {
      return normalize.element({
        className: progressRingClasses.bar,
        "data-emphasis": emphasis,
        "data-size": size,
        style: {
          cx: "calc(var(--size) / 2)",
          cy: "calc(var(--size) / 2)",
          r: "var(--radius)",
        },
      })
    },
    getCircleBindings(): QdsProgressRingCircleBindings {
      return normalize.element({
        className: progressRingClasses.circle,
        "data-emphasis": emphasis,
        "data-size": size,
        style: circleStyle,
        xmlns: "http://www.w3.org/2000/svg",
      })
    },
    getCircleContainerBindings(): QdsProgressRingCircleContainerBindings {
      return normalize.element({
        className: progressRingClasses.circleContainer,
        "data-part": "circle-container",
        "data-scope": "progress",
      })
    },
    getErrorTextBindings(): QdsProgressRingErrorTextBindings {
      return normalize.element({
        className: progressRingClasses.errorText,
      })
    },
    getLabelBindings(): QdsProgressRingLabelBindings {
      return normalize.label({
        className: progressRingClasses.label,
      })
    },
    getRootBindings(): QdsProgressRingRootBindings {
      return normalize.element({
        className: progressRingClasses.root,
        "data-size": size,
      })
    },
    getTrackBindings(): QdsProgressRingTrackBindings {
      return normalize.element({
        className: progressRingClasses.track,
        "data-size": size,
        style: {
          cx: "calc(var(--size) / 2)",
          cy: "calc(var(--size) / 2)",
          r: "var(--radius)",
        },
      })
    },
    getValueTextBindings(): QdsProgressRingValueTextBindings {
      return normalize.element({
        className: progressRingClasses.valueText,
        hidden:
          (typeof size === "number" && size <= 48) ||
          (size !== "lg" && size !== "xl"),
      })
    },
  }
}
