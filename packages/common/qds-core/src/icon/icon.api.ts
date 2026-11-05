// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {coercePixelProperty} from "@qualcomm-ui/utils/coercion"
import type {PropNormalizer} from "@qualcomm-ui/utils/machine"
import {warn} from "@qualcomm-ui/utils/warning"

import {iconClasses} from "./icon.classes.js"
import type {
  QdsIconApiProps,
  QdsIconBindings,
  QdsIconSize,
} from "./icon.types.js"

const qdsIconSizes = new Set<string>(["xs", "sm", "md", "lg", "xl"])

const cssWideKeywords = new Set<string>([
  "auto",
  "inherit",
  "initial",
  "revert",
  "revert-layer",
  "unset",
])

const bareWord = /^[a-z-]+$/i

/**
 * Returns the size of the icon when it is supplied as a pixel value, or undefined
 * if it is a predefined size.
 */
export function getIconSize(
  size: QdsIconSize | null | undefined,
): string | undefined {
  if (!size) {
    return
  }
  if (qdsIconSizes.has(size as string)) {
    // the raw size is determined by CSS
    return
  }
  const coerced = coercePixelProperty(size)
  warn(
    bareWord.test(coerced) && !cssWideKeywords.has(coerced),
    `[@qualcomm-ui/qds-core/icon] '--icon-size: ${coerced}' is invalid CSS. Expected ${[...qdsIconSizes].join(" | ")} or a CSS length.`,
  )
  return coerced
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
    style: iconSize
      ? {
          "--icon-size": iconSize,
        }
      : {},
    viewBox: props.viewBox || "0 0 24 24",
    xmlns: props.xmlns || "http://www.w3.org/2000/svg",
  })
}
