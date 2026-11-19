// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import type {
  FilterSetCapturedItem,
  FilterSetDraft,
  FilterSetSchema,
} from "./filter-set.types.js"
import {
  captureFilterItems,
  createEmptyValueCheck,
  getCollectionState,
  getSelectedValues,
  getSelectionValues,
  getUncapturedValues,
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

  refs() {
    return {
      items: {},
      options: {},
    }
  },

  states: {
    idle: {},
  },

  watch({actions, computed, context, track}) {
    /**
     * Tracks the selection rather than the collections, so that the controlled
     * `value` and other changes made outside the controls also capture the
     * items of their values.
     */
    track(
      [
        () => hashValues(context.get("value")),
        () => hashValues(computed("draftValue")),
      ],
      () => actions.captureItems(),
    )
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

      /**
       * Records the item of every selected value found in its filter's current
       * collection, and forgets the items of deselected values. Items are kept
       * for values a collection no longer contains, so the selection stays
       * labeled after a server-side search narrows the collection.
       */
      captureItems({computed, context, prop, refs}) {
        const definitions = prop("filters")
        const value = context.get("value")
        const draftValue = computed("draftValue")
        const captured = refs.get("items")
        const ids = new Set([
          ...Object.keys(value),
          ...Object.keys(draftValue),
          ...Object.keys(captured),
        ])
        const next: Record<string, Record<string, FilterSetCapturedItem>> = {}
        for (const id of ids) {
          const selected = getSelectionValues(value[id], draftValue[id])
          if (!selected.length) {
            continue
          }
          const state = getCollectionState(
            definitions?.[id],
            id,
            prop("getFilterCollection"),
            getUncapturedValues(captured[id], selected),
          )
          next[id] = captureFilterItems(
            captured[id],
            selected,
            state?.collection,
          )
        }
        refs.set("items", next)
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

      /**
       * Captures the items of the written values before the value changes,
       * from the collection the user picked them in. A controlled `value` may
       * be echoed back later, after the collection has changed.
       */
      setFilterValue({computed, context, event, guard, prop, refs}) {
        const definitions = prop("filters")
        const isEmpty = createEmptyValueCheck(definitions, prop("isEmptyValue"))
        const current = computed("draftValue")[event.id]
        const next =
          typeof event.value === "function"
            ? (event.value as (prev: unknown) => unknown)(current)
            : event.value
        const written = getSelectedValues(next)
        if (written.length) {
          const captured = refs.get("items")
          const state = getCollectionState(
            definitions?.[event.id],
            event.id,
            prop("getFilterCollection"),
            getUncapturedValues(
              captured[event.id],
              getSelectionValues(context.get("value")[event.id], current),
            ),
          )
          refs.set("items", {
            ...captured,
            [event.id]: {
              ...captured[event.id],
              ...captureFilterItems(undefined, written, state?.collection),
            },
          })
        }
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
