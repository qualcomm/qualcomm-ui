// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import type {QuiPropTypes, SerializedRef} from "@qualcomm-ui/typedoc-common"

import {selectTypeRefs} from "../doc-props/index.js"

const refs: Record<string, SerializedRef> = {
  AutoUpdateOptions: {prettyType: "interface AutoUpdateOptions {}"},
  DateValue: {prettyType: "type DateValue = CalendarDate"},
  ListFilterDefinition: {prettyType: "interface ListFilterDefinition {}"},
  Unused: {prettyType: "interface Unused {}"},
}

const pageProps: Record<string, QuiPropTypes> = {
  PickerProps: {
    name: "PickerProps",
    props: [
      {
        comment: {summary: [{kind: "text", text: "Mentions Unused in prose."}]},
        name: "listeners",
        resolvedType: {
          collapsedPrettyType: "ListFilterDefinition",
          name: "listeners",
          prettyType: "boolean | AutoUpdateOptions",
          type: "boolean | AutoUpdateOptions",
        },
      },
      {
        name: "value",
        resolvedType: {
          name: "value",
          prettyType: "DateValue",
          type: "DateValue",
        },
      },
    ],
  },
}

describe("selectTypeRefs", () => {
  test("selects the refs that displayed types name", () => {
    expect(
      Object.keys(selectTypeRefs({"/picker": pageProps}, refs)).sort(),
    ).toEqual(["AutoUpdateOptions", "DateValue", "ListFilterDefinition"])
  })

  test("pages without doc props select no refs", () => {
    expect(selectTypeRefs({}, refs)).toEqual({})
  })
})
