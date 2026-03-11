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

  guards: {
    isDismissable: ({prop}) => prop("variant") === "dismissable",
    isSelectable: ({prop}) => prop("variant") === "selectable",
  },

  initialState() {
    return "idle"
  },

  props({props}) {
    return {
      defaultSelected: false,
      dir: "ltr",
      variant: "link",
      ...props,
    }
  },

  states: {
    dismissed: {},
    idle: {
      on: {
        DISMISS: {
          actions: ["dismiss"],
          guard: "isDismissable",
          target: "dismissed",
        },
        "SELECTED.SET": {
          actions: ["setSelected"],
        },
        "SELECTED.TOGGLE": {
          actions: ["toggleSelected"],
          guard: "isSelectable",
        },
      },
    },
  },
})
