// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import type {FilterPanelSchema} from "./filter-panel.types.js"
import {
  areValuesEqual,
  createEmptyValueCheck,
  hashValues,
  pickOptionLabels,
  recordOptionLabels,
  setFilterValue,
} from "./internal/filter-panel.utils.js"

const filterPanelMachineBase = {
  computed: {
    filters: ({context, prop}) =>
      prop("applyMode") === "auto"
        ? context.get("value")
        : context.get("draft"),
  },

  context({bindable, getRefs, prop}) {
    return {
      draft: bindable(() => ({
        defaultValue: prop("value") ?? prop("defaultValue"),
        hash: hashValues,
      })),
      value: bindable(() => ({
        defaultValue: prop("defaultValue"),
        hash: hashValues,
        onChange(value) {
          prop("onValueChange")?.(value, {
            labels: pickOptionLabels(getRefs().get("labels"), value),
          })
        },
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
    "FILTER.SET": {
      actions: ["recordLabels", "setFilterValue"],
    },
    RESET: {
      actions: ["resetDraft"],
    },
  },

  props({props}) {
    return {
      applyMode: "manual",
      defaultValue: {},
      ...props,
    }
  },

  refs({prop}) {
    return {
      appliedFilters: prop("value") ?? prop("defaultValue"),
      labels: {},
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
        context.set(guard("isAutoApply") ? "value" : "draft", {})
      },

      /**
       * Labels are recorded from user selections only, before the value is
       * written, so that `onValueChange` in `auto` mode already sees them.
       * They live in refs because context reads within the same tick are
       * stale; every recording accompanies a value change, which re-renders.
       * Restored values rely on the definition or panel resolvers for labels.
       */
      recordLabels({event, refs}) {
        if (event.labels) {
          refs.set(
            "labels",
            recordOptionLabels(refs.get("labels"), event.id, event.labels),
          )
        }
      },

      resetDraft({context, guard}) {
        if (guard("isAutoApply")) {
          return
        }
        context.set("draft", context.get("value"))
      },

      setFilterValue({context, event, guard, prop}) {
        const isEmpty = createEmptyValueCheck(
          prop("filters"),
          prop("isEmptyValue"),
        )
        context.set(guard("isAutoApply") ? "value" : "draft", (values) =>
          setFilterValue(isEmpty, values, event.id, event.value),
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

        const isEmpty = createEmptyValueCheck(
          prop("filters"),
          prop("isEmptyValue"),
        )
        if (
          guard("isAutoApply") ||
          areValuesEqual(isEmpty, context.get("draft"), previous)
        ) {
          context.set("draft", value)
        }
      },
    },
    guards: {
      isAutoApply: ({prop}) => prop("applyMode") === "auto",
    },
  })
