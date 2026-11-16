// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import {
  areFiltersEqual,
  getIdentityKey,
  setFilterValue,
} from "./internal/table-filter-panel.utils.js"
import type {TableFilterPanelSchema} from "./table-filter-panel.types.js"

const tableFilterPanelMachineBase = {
  computed: {
    filters: ({context, prop}) =>
      prop("applyMode") === "auto"
        ? prop("table").getState().columnFilters
        : context.get("draft"),
  },

  context({bindable, prop}) {
    return {
      draft: bindable(() => ({
        defaultValue: prop("table").getState().columnFilters,
      })),
      registryVersion: bindable(() => ({
        defaultValue: 0,
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
    SYNC: {
      actions: ["syncDraft"],
    },
  },

  props({props}) {
    const {table} = props
    if (!table) {
      throw new Error(
        "[@qualcomm-ui/core/table-filter-panel] `table` is required",
      )
    }
    return {
      applyMode: "manual",
      ...props,
      table,
    }
  },

  refs({prop}) {
    return {
      appliedFilters: prop("table").getState().columnFilters,
      registry: new Map(),
    }
  },

  states: {
    idle: {},
  },

  watch({action, prop, track}) {
    track(
      [() => getIdentityKey(prop("table").getState().columnFilters)],
      () => {
        action(["syncDraft"])
      },
    )
  },
} satisfies MachineConfigBase<TableFilterPanelSchema>

export const tableFilterPanelMachine: MachineConfig<TableFilterPanelSchema> =
  createNarrowedMachine<TableFilterPanelSchema>()(tableFilterPanelMachineBase, {
    actions: {
      applyDraft({context, guard, prop}) {
        if (guard("isAutoApply")) {
          return
        }
        prop("table").setColumnFilters(context.get("draft"))
      },

      clearFilters({context, guard, prop}) {
        if (guard("isAutoApply")) {
          prop("table").setColumnFilters([])
          return
        }
        context.set("draft", [])
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

      resetDraft({context, guard, prop}) {
        if (guard("isAutoApply")) {
          return
        }
        context.set("draft", prop("table").getState().columnFilters)
      },

      setFilterValue({context, event, guard, prop}) {
        const table = prop("table")
        if (guard("isAutoApply")) {
          table.setColumnFilters((filters) =>
            setFilterValue(table, filters, event.id, event.value),
          )
          return
        }
        context.set("draft", (draft) =>
          setFilterValue(table, draft, event.id, event.value),
        )
      },

      /**
       * Follows external changes to the table's filters (for example, a filter
       * chip removed from the toolbar) unless the draft has pending changes,
       * which would otherwise be discarded.
       */
      syncDraft({context, guard, prop, refs}) {
        const table = prop("table")
        const applied = table.getState().columnFilters
        const previous = refs.get("appliedFilters")
        refs.set("appliedFilters", applied)

        if (
          guard("isAutoApply") ||
          areFiltersEqual(table, context.get("draft"), previous)
        ) {
          context.set("draft", applied)
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
