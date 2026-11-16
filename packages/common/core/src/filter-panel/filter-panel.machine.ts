// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import type {FilterPanelSchema} from "./filter-panel.types.js"
import {areFiltersEqual, setFilterValue} from "./internal/filter-panel.utils.js"

const filterPanelMachineBase = {
  computed: {
    filters: ({context, prop}) =>
      prop("applyMode") === "auto"
        ? context.get("value")
        : context.get("draft"),
  },

  context({bindable, prop}) {
    return {
      draft: bindable(() => ({
        defaultValue: prop("value") ?? prop("defaultValue"),
      })),
      registryVersion: bindable(() => ({
        defaultValue: 0,
      })),
      value: bindable(() => ({
        defaultValue: prop("defaultValue"),
        hash: (filters) => JSON.stringify(filters),
        onChange: prop("onValueChange"),
        value: prop("value"),
      })),
    }
  },

  initialState() {
    return "idle" as const
  },

  on: {
    APPLY: {
      actions: ["applyDraft"],
    },
    CLEAR_ALL: {
      actions: ["clearFilters"],
    },
    "FILTER.REGISTER": {
      actions: ["registerFilter"],
    },
    "FILTER.SET": {
      actions: ["setFilterValue"],
    },
    "FILTER.UNREGISTER": {
      actions: ["unregisterFilter"],
    },
    RESET: {
      actions: ["resetDraft"],
    },
  },

  props({props}) {
    return {
      applyMode: "manual",
      defaultValue: [],
      ...props,
    }
  },

  refs({prop}) {
    return {
      appliedFilters: prop("value") ?? prop("defaultValue"),
      registry: new Map(),
    }
  },

  states: {
    idle: {},
  },

  watch({action, context, track}) {
    track([() => context.hash("value")], () => {
      action(["syncDraft"])
    })
  },
} satisfies MachineConfigBase<FilterPanelSchema>

export const filterPanelMachine: MachineConfig<FilterPanelSchema> =
  createNarrowedMachine<FilterPanelSchema>()(filterPanelMachineBase, {
    actions: {
      applyDraft({context, guard}) {
        if (guard("isAutoApply")) {
          return
        }
        context.set("value", context.get("draft"))
      },

      clearFilters({context, guard}) {
        context.set(guard("isAutoApply") ? "value" : "draft", [])
      },

      /**
       * The registry lives in refs rather than context because sibling filter
       * sections register in the same tick on mount, and context updates
       * within a tick read stale state. The version counter only exists to
       * trigger a re-render so registered labels become visible.
       */
      registerFilter({context, event, refs}) {
        refs.get("registry").set(event.filter.id, event.filter)
        context.set("registryVersion", (version) => version + 1)
      },

      resetDraft({context, guard}) {
        if (guard("isAutoApply")) {
          return
        }
        context.set("draft", context.get("value"))
      },

      setFilterValue({context, event, guard, prop}) {
        context.set(guard("isAutoApply") ? "value" : "draft", (filters) =>
          setFilterValue(prop("isEmptyValue"), filters, event.id, event.value),
        )
      },

      /**
       * Follows external changes to the committed filters (for example, a
       * filter chip removed from the toolbar) unless the draft has pending
       * changes, which would otherwise be discarded.
       */
      syncDraft({context, guard, prop, refs}) {
        const value = context.get("value")
        const previous = refs.get("appliedFilters")
        refs.set("appliedFilters", value)

        if (
          guard("isAutoApply") ||
          areFiltersEqual(prop("isEmptyValue"), context.get("draft"), previous)
        ) {
          context.set("draft", value)
        }
      },

      unregisterFilter({context, event, refs}) {
        if (refs.get("registry").delete(event.id)) {
          context.set("registryVersion", (version) => version + 1)
        }
      },
    },
    guards: {
      isAutoApply: ({prop}) => prop("applyMode") === "auto",
    },
  })
