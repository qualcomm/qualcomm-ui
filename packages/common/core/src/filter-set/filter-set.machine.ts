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
    "DRAFT.CLEAR_ALL": {
      actions: ["clearDraftFilters"],
    },
    "DRAFT.SET": {
      actions: ["setDraftFilterValue"],
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

  watch({action, computed, track}) {
    /**
     * `draftValue` also changes without an event when a new `value` replaces
     * the draft, so the callback follows its hash instead of being invoked
     * from the actions.
     */
    track([() => hashValues(computed("draftValue"))], () => {
      action(["invokeOnDraftValueChange"])
    })
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

      clearDraftFilters({context, guard}) {
        if (guard("isAutoApply")) {
          context.set("value", {})
          return
        }
        context.set("draft", {
          base: hashValues(context.get("value")),
          values: {},
        })
      },

      clearFilters({context}) {
        context.set("value", {})
        context.set("draft", null)
      },

      invokeOnDraftValueChange({computed, prop}) {
        prop("onDraftValueChange")?.(computed("draftValue"))
      },

      resetDraft({context}) {
        context.set("draft", null)
      },

      setDraftFilterValue({computed, context, event, guard, prop}) {
        const isEmpty = createEmptyValueCheck(
          prop("filters"),
          prop("isEmptyValue"),
        )
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

      /**
       * Commits the change, then applies the same change to a pending draft so
       * that its staged changes to other filters survive.
       */
      setFilterValue({context, event, prop}) {
        const isEmpty = createEmptyValueCheck(
          prop("filters"),
          prop("isEmptyValue"),
        )
        const value = context.get("value")
        const draft = context.get("draft")
        const next = setFilterValue(isEmpty, value, event.id, event.value)
        context.set("value", next)
        if (draft?.base === hashValues(value)) {
          context.set("draft", {
            base: hashValues(next),
            values: setFilterValue(
              isEmpty,
              draft.values,
              event.id,
              event.value,
            ),
          })
        }
      },
    },
    guards: {
      isAutoApply: ({prop}) => prop("applyMode") === "auto",
    },
  })
