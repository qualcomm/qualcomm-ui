import type {JSX, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {ProgressCircleSize} from "./progress-circle.types"

export interface VsProgressCircleApiProps {
  /**
   * The width and height of the progress circle. Supply as a number for
   * fine-grained customization.
   *
   * @default 'md'
   */
  size?: ProgressCircleSize
}

export interface VsProgressCircleRootBindings {
  className: string
  "data-size": ProgressCircleSize
}

export interface VsProgressCircleCircleContainerBindings {
  className: string
}

export interface VsProgressCircleCircleBindings {
  className: string
  "data-size": ProgressCircleSize
  style: JSX.CSSProperties
  xmlns: string
}

export interface VsProgressCircleTrackBindings {
  className: string
  style: JSX.CSSProperties
}

export interface VsProgressCircleBarBindings {
  className: string
  style: JSX.CSSProperties
}

export interface VsProgressCircleLabelBindings {
  className: string
}

export interface VsProgressCircleValueTextBindings {
  className: string
}

export interface VsProgressCircleErrorTextBindings {
  className: string
}

export interface VsProgressCircleApi {
  size: ProgressCircleSize

  // group: bindings
  getBarBindings(): VsProgressCircleBarBindings
  getCircleBindings(): VsProgressCircleCircleBindings
  getCircleContainerBindings(): VsProgressCircleCircleContainerBindings
  getErrorTextBindings(): VsProgressCircleErrorTextBindings
  getLabelBindings(): VsProgressCircleLabelBindings
  getRootBindings(): VsProgressCircleRootBindings
  getTrackBindings(): VsProgressCircleTrackBindings
  getValueTextBindings(): VsProgressCircleValueTextBindings
}

export function createVsProgressCircleApi(
  props: VsProgressCircleApiProps,
  normalize: PropNormalizer,
): VsProgressCircleApi {
  const size = props.size || "md"
  const circleStyle: JSX.CSSProperties = {}
  if (typeof size === "number") {
    circleStyle["--size-override"] = `${size}px`
  }

  return {
    size,

    // group: bindings
    getBarBindings(): VsProgressCircleBarBindings {
      return normalize.element({
        className: "vs-progress-circle__bar",
        style: {
          cx: "calc(var(--size) / 2)",
          cy: "calc(var(--size) / 2)",
          r: "var(--radius)",
        },
      })
    },
    getCircleBindings(): VsProgressCircleCircleBindings {
      return normalize.element({
        className: "vs-progress-circle__circle",
        "data-size": size,
        style: circleStyle,
        xmlns: "http://www.w3.org/2000/svg",
      })
    },
    getCircleContainerBindings(): VsProgressCircleCircleContainerBindings {
      return normalize.element({
        className: "vs-progress-circle__circle-container",
      })
    },
    getErrorTextBindings(): VsProgressCircleErrorTextBindings {
      return normalize.element({
        className: "vs-progress-circle__error-text",
      })
    },
    getLabelBindings(): VsProgressCircleLabelBindings {
      return normalize.label({
        className: "vs-progress-circle__label",
      })
    },
    getRootBindings(): VsProgressCircleRootBindings {
      return normalize.element({
        className: "vs-progress-circle",
        "data-size": size,
      })
    },
    getTrackBindings(): VsProgressCircleTrackBindings {
      return normalize.element({
        className: "vs-progress-circle__track",
        style: {
          cx: "calc(var(--size) / 2)",
          cy: "calc(var(--size) / 2)",
          r: "var(--radius)",
        },
      })
    },
    getValueTextBindings(): VsProgressCircleValueTextBindings {
      return normalize.element({
        className: "vs-progress-circle__value-text",
      })
    },
  }
}
