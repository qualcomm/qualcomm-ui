// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {DataItemProps} from "../../type"

import {defineEasyType} from "./define-easy-type"

export function isEnum(props: {
  value: unknown
}): props is DataItemProps & {value: {enum: Array<string | number>}} {
  return !!(
    props.value &&
    typeof props.value === "object" &&
    "enum" in props.value
  )
}

export const stringEnumType = defineEasyType<
  DataItemProps & {
    enum: Array<string | number>
  }
>({
  colorKey: "base09",
  is: (value: unknown) =>
    !!(
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "string" &&
      isEnum({value})
    ),
  Renderer(props) {
    const enumValues = props.value.enum
    return (
      <>
        <div className="data-value">string enum</div>
        <div className="data-value-enum">
          [
          {enumValues
            .map((v) => (typeof v === "string" ? `"${v}"` : v))
            .join(", ")}
          ]
        </div>
      </>
    )
  },
  type: "string",
})
