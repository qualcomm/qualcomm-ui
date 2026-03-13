// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import type {ToggleSchema} from "./toggle.types"

const toggleMachineBase = {
  context({bindable, prop}) {
    return {
      pressed: bindable<boolean>(() => ({
        defaultValue: prop("defaultPressed"),
        onChange(value) {
          prop("onPressedChange")?.(value)
        },
        value: prop("pressed"),
      })),
    }
  },

  initialState() {
    return "idle" as const
  },

  on: {
    "PRESS.SET": {
      actions: ["setPressed"],
    },
    "PRESS.TOGGLE": {
      actions: ["togglePressed"],
    },
  },

  props({props}) {
    return {
      defaultPressed: false,
      dir: "ltr",
      ...props,
    }
  },

  states: {
    idle: {},
  },
} satisfies MachineConfigBase<ToggleSchema>

export const toggleMachine: MachineConfig<ToggleSchema> =
  createNarrowedMachine<ToggleSchema>()(toggleMachineBase, {
    setPressed({context, event}) {
      context.set("pressed", event.value || false)
    },
    togglePressed({context}) {
      context.set("pressed", !context.get("pressed"))
    },
  })
