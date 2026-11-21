// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import type {FilterSetDraft, FilterSetSchema} from "./filter-set.types.js"
import {
  createEmptyValueCheck,
  hashValues,
  setFilterValue,
} from "./internal/filter-set.utils.js"

const filterSetMachineBase = {
  computed: {
    /**
     * The draft only applies to the committed value it was started from. When
     * `value` changes, including through the controlled `value` prop, the
     * draft is discarded without having to be synced.
     */
    draftValue: ({context, prop}) => {
      const value = context.get("value")
      const draft = context.get("draft")
      if (
        prop("applyMode") === "auto" ||
        !draft ||
        draft.base !== hashValues(value)
      ) {
        return value
      }
      return draft.values
    },
  },

  context({bindable, prop}) {
    return {
      draft: bindable<FilterSetDraft | null>(() => ({
        defaultValue: null,
        hash: (draft) => (draft ? draft.base + hashValues(draft.values) : ""),
      })),
      value: bindable(() => ({
        defaultValue: prop("defaultValue"),
        hash: hashValues,
        onChange(value) {
          prop("onValueChange")?.(value)
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
      actions: ["setFilterValue"],
    },
    RESET: {
      actions: ["resetDraft"],
    },
  },

  props({props}) {
    return {
      applyMode: "auto",
      defaultValue: {},
      ...props,
    }
  },

  states: {
    idle: {},
  },
} satisfies MachineConfigBase<FilterSetSchema>

export const filterSetMachine: MachineConfig<FilterSetSchema> =
  createNarrowedMachine<FilterSetSchema>()(filterSetMachineBase, {
    actions: {
      applyDraft({computed, context, guard}) {
        if (guard("isAutoApply")) {
          return
        }
        context.set("value", computed("draftValue"))
        context.set("draft", null)
      },

      clearFilters({context, guard}) {
        if (guard("isAutoApply")) {
          context.set("value", {})
          return
        }
        context.set("draft", {
          base: hashValues(context.get("value")),
          values: {},
        })
      },

      resetDraft({context}) {
        context.set("draft", null)
      },

      setFilterValue({computed, context, event, guard, prop}) {
        const definitions = prop("filters")
        const isEmpty = createEmptyValueCheck(definitions, prop("isEmptyValue"))
        const current = computed("draftValue")[event.id]
        const next =
          typeof event.value === "function"
            ? (event.value as (prev: unknown) => unknown)(current)
            : event.value
        if (guard("isAutoApply")) {
          context.set("value", (values) =>
            setFilterValue(isEmpty, values, event.id, next),
          )
          return
        }
        const value = context.get("value")
        const base = hashValues(value)
        context.set("draft", (draft) => ({
          base,
          values: setFilterValue(
            isEmpty,
            draft?.base === base ? draft.values : value,
            event.id,
            next,
          ),
        }))
      },
    },
    guards: {
      isAutoApply: ({prop}) => prop("applyMode") === "auto",
    },
  })
