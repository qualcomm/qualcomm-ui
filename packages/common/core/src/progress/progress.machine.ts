// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isDefined, isNumber} from "@qualcomm-ui/utils/guard"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"
import {getRoundedValuePercent} from "@qualcomm-ui/utils/number"

import type {ProgressSchema} from "./progress.types"

export const progressMachine: MachineConfig<ProgressSchema> =
  createMachine<ProgressSchema>({
    actions: {
      setValue: ({context, event}) => {
        if ("value" in event) {
          context.set("value", event.value)
        }
      },
    },
    computed: {
      isIndeterminate: ({context}) => {
        return !isDefined(context.get("value"))
      },
      state: ({computed, context, prop}) => {
        if (computed("isIndeterminate")) {
          return "indeterminate"
        }
        return context.get("value") === prop("max") ? "complete" : "loading"
      },
      valuePercent: ({context, prop}) => {
        const value = context.get("value")
        if (!isNumber(value)) {
          return -1
        }
        return getRoundedValuePercent(value, prop("min"), prop("max"), 0)
      },
    },
    context: ({bindable, prop}) => {
      return {
        value: bindable<number | undefined>(() => ({
          defaultValue: prop("defaultValue"),
          onChange: prop("onValueChange"),
          value: prop("value"),
        })),
      }
    },
    ids: ({bindableId, ids}) => {
      return {
        errorText: bindableId(ids?.errorText),
        hint: bindableId(ids?.hint),
        label: bindableId(ids?.label),
        progress: bindableId(ids?.progress),
      }
    },
    initialState: () => "idle",
    on: {
      SET_VALUE: {
        actions: ["setValue"],
      },
    },
    props: ({props}) => {
      return {
        dir: "ltr",
        max: 100,
        min: 0,
        ...props,
      }
    },
    states: {
      idle: {},
    },
  })
