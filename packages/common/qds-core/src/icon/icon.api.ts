// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {coercePixelProperty} from "@qualcomm-ui/utils/coercion"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"

import {iconClasses} from "./icon.classes"
import type {QdsIconApiProps, QdsIconBindings, QdsIconSize} from "./icon.types"

const qdsIconSizes = new Set<string>(["xs", "sm", "md", "lg", "xl"])

export function getIconSize(
  size: QdsIconSize | null | undefined,
): string | undefined {
  if (!size) {
    return
  }
  // the raw size is determined by CSS
  return qdsIconSizes.has(size as string)
    ? // handled by CSS
      undefined
    : coercePixelProperty(size)
}

export function getQdsIconBindings(
  props: QdsIconApiProps,
  normalize: PropNormalizer,
): QdsIconBindings {
  const iconSize = getIconSize(props.size)
  return normalize.element({
    className: iconClasses.root,
    "data-size": iconSize ?? (props.size || "md"),
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    viewBox: props.viewBox || "0 0 24 24",
    xmlns: props.xmlns || "http://www.w3.org/2000/svg",
  })
}
