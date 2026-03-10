// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import type {TagSchema} from "./tag.types"

export const tagMachine: MachineConfig<TagSchema> = createMachine<TagSchema>({
  actions: {
    dismiss: ({prop}) => {
      prop("onDismiss")?.()
    },
    setSelected({context, event}) {
      if ("value" in event) {
        context.set("selected", event.value || false)
      }
    },
    toggleSelected({context}) {
      context.set("selected", !context.get("selected"))
    },
  },

  context({bindable, prop}) {
    return {
      selected: bindable<boolean>(() => ({
        defaultValue: prop("defaultSelected"),
        onChange(value) {
          prop("onSelectedChange")?.(value)
        },
        value: prop("selected"),
      })),
    }
  },

  initialState() {
    return "idle"
  },

  on: {
    DISMISS: {
      actions: ["dismiss"],
    },
    "SELECTED.SET": {
      actions: ["setSelected"],
    },
    "SELECTED.TOGGLE": {
      actions: ["toggleSelected"],
    },
  },

  props({props}) {
    return {
      defaultSelected: false,
      dir: "ltr",
      ...props,
    }
  },

  states: {
    idle: {},
  },
})
