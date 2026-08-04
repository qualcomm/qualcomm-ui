// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {defineEasyType} from "./define-easy-type"
import {isEnum} from "./string-enum-type"

export const stringSchemaType = defineEasyType<string | NonNullable<unknown>>({
  colorKey: "base09",
  is: (value: unknown) =>
    !!(
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === "string" &&
      !isEnum({value})
    ),
  Renderer: () => {
    return <span className="data-value">string</span>
  },
  type: "string",
})
