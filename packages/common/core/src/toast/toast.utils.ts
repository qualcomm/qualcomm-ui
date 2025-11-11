// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {MAX_Z_INDEX} from "@qualcomm-ui/dom/query"
import type {JSX, Machine} from "@qualcomm-ui/utils/machine"

import type {
  ToastGroupSchema,
  ToastPlacement,
  ToastSchema,
  ToastType,
} from "./toast.types"

export const defaultTimeouts: Record<ToastType, number> = {
  danger: 5000,
  info: 5000,
  loading: Infinity,
  neutral: 3000,
  success: 2000,
  warning: 5000,
}

export function getToastDuration(
  duration: number | undefined,
  type: ToastType,
): number {
  return duration ?? defaultTimeouts[type] ?? 5000
}

function getOffsets(
  offsets: string | Record<"left" | "right" | "bottom" | "top", string>,
) {
  return typeof offsets === "string"
    ? {bottom: offsets, left: offsets, right: offsets, top: offsets}
    : offsets
}

export function getGroupPlacementStyle(
  machine: Machine<ToastGroupSchema>,
  placement: ToastPlacement,
): JSX.CSSProperties {
  const {computed, context, prop} = machine
  const {gap, offsets} = prop("store").attrs

  const heights = context.get("heights")
  const computedOffset = getOffsets(offsets)

  const rtl = prop("dir") === "rtl"
  const computedPlacement = placement
    .replace("-start", rtl ? "-right" : "-left")
    .replace("-end", rtl ? "-left" : "-right")

  const isRighty = computedPlacement.includes("right")
  const isLefty = computedPlacement.includes("left")

  const styles: JSX.CSSProperties = {
    "--first-height": `${heights[0]?.height || 0}px`,
    "--gap": `${gap}px`,
    display: "flex",
    flexDirection: "column",
    pointerEvents: computed("count") > 0 ? undefined : "none",
    position: "fixed",
    zIndex: MAX_Z_INDEX,
  }

  let alignItems: JSX.CSSProperties["alignItems"] = "center"
  if (isRighty) {
    alignItems = "flex-end"
  }
  if (isLefty) {
    alignItems = "flex-start"
  }

  styles.alignItems = alignItems

  if (computedPlacement.includes("top")) {
    const offset = computedOffset.top
    styles.top = `max(env(safe-area-inset-top, 0px), ${offset})`
  }

  if (computedPlacement.includes("bottom")) {
    const offset = computedOffset.bottom
    styles.bottom = `max(env(safe-area-inset-bottom, 0px), ${offset})`
  }

  if (!computedPlacement.includes("left")) {
    const offset = computedOffset.right
    styles.insetInlineEnd = `calc(env(safe-area-inset-right, 0px) + ${offset})`
  }

  if (!computedPlacement.includes("right")) {
    const offset = computedOffset.left
    styles.insetInlineStart = `calc(env(safe-area-inset-left, 0px) + ${offset})`
  }

  return styles
}

export function getPlacementStyle(
  machine: Machine<ToastSchema>,
  visible: boolean,
): JSX.CSSProperties {
  const {computed, context, prop} = machine

  const parent = prop("parent")
  const placement = parent.computed("placement")
  const {gap} = parent.prop("store").attrs

  const [side] = placement.split("-")

  const mounted = context.get("mounted")
  const remainingTime = context.get("remainingTime")

  const height = computed("height")
  const frontmost = computed("frontmost")
  const sibling = !frontmost

  const overlap = !prop("stacked")
  const stacked = prop("stacked")
  const type = prop("type")

  const duration = type === "loading" ? Number.MAX_SAFE_INTEGER : remainingTime
  const offset = computed("heightIndex") * gap + computed("heightBefore")

  const styles: JSX.CSSProperties = {
    "--duration": `${duration}ms`,
    "--index": prop("index"),
    "--initial-height": `${height}px`,
    "--lift-amount": "calc(var(--lift) * var(--gap))",
    "--offset": `${offset}px`,
    "--opacity": "0",
    "--remove-delay": `${prop("removeDelay")}ms`,
    "--x": "0",
    "--y": "100%",
    "--z-index": computed("zIndex"),
    pointerEvents: "auto",
    position: "absolute",
  }

  const assign = (overrides: JSX.CSSProperties) =>
    Object.assign(styles, overrides)

  if (side === "top") {
    //
    assign({
      "--lift": "1",
      "--sign": "-1",
      "--y": "-100%",
      top: "0",
    })
    //
  } else if (side === "bottom") {
    //
    assign({
      "--lift": "-1",
      "--sign": "1",
      "--y": "100%",
      bottom: "0",
    })
  }

  if (mounted) {
    assign({
      "--opacity": "1",
      "--y": "0",
    })

    if (stacked) {
      assign({
        "--height": "var(--initial-height)",
        "--y": "calc(var(--lift) * var(--offset))",
      })
    }
  }

  if (!visible) {
    assign({
      "--opacity": "0",
      pointerEvents: "none",
    })
  }

  if (sibling && overlap) {
    assign({
      "--base-scale": "var(--index) * 0.05 + 1",
      "--height": "var(--first-height)",
      "--scale": "calc(-1 * var(--base-scale))",
      "--y": "calc(var(--lift-amount) * var(--index))",
    })

    if (!visible) {
      assign({
        "--y": "calc(var(--sign) * 40%)",
      })
    }
  }

  if (sibling && stacked && !visible) {
    assign({
      "--y": "calc(var(--lift) * var(--offset) + var(--lift) * -100%)",
    })
  }

  if (frontmost && !visible) {
    assign({
      "--y": "calc(var(--lift) * -100%)",
    })
  }

  return styles
}

export function getGhostBeforeStyle(
  service: Machine<ToastSchema>,
  visible: boolean,
): JSX.CSSProperties {
  const {computed} = service
  const styles: JSX.CSSProperties = {
    inset: "0",
    pointerEvents: visible ? "none" : "auto",
    position: "absolute",
    scale: "1 2",
  }

  function assign(overrides: JSX.CSSProperties) {
    return Object.assign(styles, overrides)
  }

  if (computed("frontmost") && !visible) {
    assign({
      height: "calc(var(--initial-height) + 80%)",
    })
  }

  return styles
}

export function getGhostAfterStyle(): JSX.CSSProperties {
  return {
    bottom: "100%",
    height: "calc(var(--gap) + 2px)",
    left: "0",
    position: "absolute",
    width: "100%",
  }
}
