// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import type {TagSchema} from "./tag.types"

const tagMachineBase = {
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
} satisfies MachineConfigBase<TagSchema>

export const tagMachine: MachineConfig<TagSchema> =
  createNarrowedMachine<TagSchema>()(tagMachineBase, {
    actions: {
      dismiss: ({prop}) => {
        prop("onDismiss")?.()
      },
      setSelected({context, event}) {
        context.set("selected", event.value || false)
      },
      toggleSelected({context}) {
        context.set("selected", !context.get("selected"))
      },
    },
    guards: {
      isDismissable: ({prop}) => prop("variant") === "dismissable",
      isSelectable: ({prop}) => prop("variant") === "selectable",
    },
  })
