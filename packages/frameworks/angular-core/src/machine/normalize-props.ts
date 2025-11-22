// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {normalizeAriaAttr} from "@qualcomm-ui/utils/attributes"
import {clsx} from "@qualcomm-ui/utils/clsx"
import {isObject, isString} from "@qualcomm-ui/utils/guard"
import {createPropNormalizer} from "@qualcomm-ui/utils/machine"
import type {Dict} from "@qualcomm-ui/utils/object"

const propMap: Record<string, string> = {
  className: "class",
  defaultChecked: "checked",
  defaultValue: "value",
  htmlFor: "for",
  onBlur: "onfocusout",
  onChange: "oninput",
  onDoubleClick: "ondblclick",
  onFocus: "onfocusin",
  readOnly: "readonly",
}

const preserveKeys: Set<string> = new Set<string>([
  "viewBox",
  "className",
  "preserveAspectRatio",
  "fillRule",
  "clipPath",
  "clipRule",
])

const transformers: Record<string, (value: unknown) => any> = {
  "aria-hidden": normalizeAriaAttr,
}

export type StyleObject = Record<string, string | number>

export const normalizeProps = createPropNormalizer((props) => {
  const normalized: Dict = {}

  for (const [key, value] of Object.entries(props)) {
    if (key === "style") {
      if (isString(value)) {
        normalized["style"] = serializeStyle(value)
      } else if (isObject(value)) {
        normalized["style"] = hyphenateStyle(value)
      }

      continue
    }

    if (key === "className") {
      if (isString(value)) {
        normalized["class"] = value
      } else {
        normalized["class"] = clsx(value)
      }
      continue
    }

    if (key === "children") {
      if (isString(value)) {
        normalized["textContent"] = value
      }

      continue
    }

    if (key in transformers) {
      normalized[key] = transformers[key](value)
      continue
    }

    normalized[toAngularProp(key)] = value
  }

  return normalized
})

const STYLE_REGEX = /((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g

function serializeStyle(style: string) {
  const res: StyleObject = {}

  let match: RegExpExecArray | null

  while ((match = STYLE_REGEX.exec(style))) {
    res[match[1]] = match[2]
  }

  return res
}

function hyphenateStyle(style: Record<string, string | number>): StyleObject {
  const res: StyleObject = {}

  for (const [property, value] of Object.entries(style)) {
    if (value === null || value === undefined) {
      continue
    }

    res[hyphenateStyleName(property)] = value
  }

  return res
}

const cache = new Map<string, string>()
const uppercasePattern = /[A-Z]/g
const msPattern = /^ms-/

function hyphenateStyleName(name: string) {
  if (name.startsWith("--")) {
    return name
  }

  if (cache.has(name)) {
    return cache.get(name)!
  }

  const hName = name.replace(uppercasePattern, toHyphenLower)

  return cache.set(name, msPattern.test(hName) ? `-${hName}` : hName).get(name)!
}

function toHyphenLower(match: string) {
  return `-${match.toLowerCase()}`
}

function toAngularProp(prop: string) {
  if (prop in propMap) {
    return propMap[prop]
  }

  if (preserveKeys.has(prop)) {
    return prop
  }

  return prop.toLowerCase()
}
