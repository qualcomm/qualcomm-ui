// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import type {
  FilterPanelDraft,
  FilterPanelSchema,
} from "./filter-panel.types.js"
import {
  createEmptyValueCheck,
  hashValues,
  pickOptionLabels,
  recordOptionLabels,
  setFilterValue,
} from "./internal/filter-panel.utils.js"

const filterPanelMachineBase = {
  computed: {
    /**
     * The draft only applies to the committed value it was started from. When
     * `value` changes, including from outside the panel, the draft is
     * discarded without having to be synced.
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

  context({bindable, getRefs, prop}) {
    return {
      draft: bindable<FilterPanelDraft | null>(() => ({
        defaultValue: null,
        hash: (draft) => (draft ? draft.base + hashValues(draft.values) : ""),
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
      applyMode: "auto",
      defaultValue: {},
      ...props,
    }
  },

  refs() {
    return {
      labels: {},
    }
  },

  states: {
    idle: {},
  },

} satisfies MachineConfigBase<FilterPanelSchema>

export const filterPanelMachine: MachineConfig<FilterPanelSchema> =
  createNarrowedMachine<FilterPanelSchema>()(filterPanelMachineBase, {
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

      resetDraft({context}) {
        context.set("draft", null)
      },

      setFilterValue({context, event, guard, prop}) {
        const isEmpty = createEmptyValueCheck(
          prop("filters"),
          prop("isEmptyValue"),
        )
        if (guard("isAutoApply")) {
          context.set("value", (values) =>
            setFilterValue(isEmpty, values, event.id, event.value),
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
            event.value,
          ),
        }))
      },

    },
    guards: {
      isAutoApply: ({prop}) => prop("applyMode") === "auto",
    },
  })
