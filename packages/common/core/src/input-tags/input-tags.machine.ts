// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackElementSize} from "@qualcomm-ui/dom/element-size"
import {raf} from "@qualcomm-ui/dom/query"
import {ensureProps} from "@qualcomm-ui/utils/guard"
import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import {calculateVisibleTags} from "./input-tags.overflow"
import type {InputTagsSchema} from "./input-tags.types"
import {
  getControlEl,
  getInputElement,
  getInvisibleTagEl,
  getMeasureIndicatorEl,
} from "./internal"

const inputTagsMachineBase = {
  computed: {
    empty: ({prop}) => {
      const values = prop("value")
      return !values?.length
    },
    hasOverflow: ({computed}) => {
      return computed("overflowTagCount") > 0
    },

    overflowTagCount: ({context, prop}) => {
      const values = prop("value")
      const total = values?.length ?? 0
      return Math.max(0, total - context.get("visibleTagIndices").length)
    },

    showSelectionCount: ({prop}) => prop("open") || prop("inputFocused"),

    visibleTags: ({context, prop}) => {
      const values = prop("value") ?? []
      const indices = context.get("visibleTagIndices")
      return indices.map((i) => values[i]).filter(Boolean)
    },
  },

  context({bindable}) {
    return {
      availableTagWidth: bindable<number>(() => ({
        defaultValue: 0,
      })),
      overflowTagWidth: bindable<number>(() => ({
        defaultValue: 0,
      })),
      tagWidths: bindable<number[]>(() => ({
        defaultValue: [],
        hash: (v) => v.join(","),
        sync: true,
      })),
      visibleTagIndices: bindable<number[]>(() => ({
        defaultValue: [],
        hash: (v) => v.join(","),
      })),
    }
  },

  effects: {
    trackControlResize({context, prop, scope, send}) {
      const controlElement = getControlEl(scope)
      if (!controlElement) {
        return
      }

      return trackElementSize(controlElement, (size) => {
        if (size) {
          const inputElementRect =
            getInputElement(scope)?.getBoundingClientRect()
          const controlElementRect =
            getControlEl(scope)?.getBoundingClientRect()
          if (!inputElementRect || !controlElementRect) {
            return
          }
          const isRtl = prop("dir") === "rtl"
          const availableWidth = isRtl
            ? controlElementRect.right - inputElementRect.left
            : inputElementRect.right - controlElementRect.left
          context.set("availableTagWidth", availableWidth)
          send({type: "REMEASURE"})
        }
      })
    },
  },

  ids: ({bindableId, ids}) => ({
    invisibleTagContainer: bindableId(ids?.invisibleTagContainer),
    tagContainer: bindableId(ids?.tagContainer),
  }),

  initialState() {
    return "idle"
  },

  on: {
    REMEASURE: {
      actions: ["measureTags", "measureOverflowTag", "recalculateVisibleTags"],
    },
    "TAG.DISMISS": {
      actions: ["dismissTag"],
    },
  },

  props({props}) {
    ensureProps(
      props,
      ["value", "onSelectValue", "inputFocused", "focusInput"],
      "tags",
    )
    return {
      dir: "ltr",
      gap: 4,
      minInputWidth: 75,
      ...props,
    }
  },

  refs() {
    return {
      tagObserver: null,
    }
  },

  states: {
    idle: {
      effects: ["trackControlResize"],
    },
  },

  watch({computed, prop, send, track}) {
    track(
      [
        () => JSON.stringify(prop("value")),
        () => computed("showSelectionCount"),
      ],
      () => {
        raf(() => {
          send({type: "REMEASURE"})
        })
      },
    )
  },
} satisfies MachineConfigBase<InputTagsSchema>

export const inputTagsMachine: MachineConfig<InputTagsSchema> =
  createNarrowedMachine<InputTagsSchema>()(inputTagsMachineBase, {
    dismissTag({event, prop}) {
      if (!event.value) {
        return
      }
      prop("onSelectValue")(event.value)
    },

    measureOverflowTag({context, scope}) {
      const el = getMeasureIndicatorEl(scope)
      if (el) {
        context.set("overflowTagWidth", el.getBoundingClientRect().width)
      }
    },

    measureTags({context, prop, scope}) {
      const values = prop("value") ?? []
      const tagWidths: number[] = []
      for (const value of values) {
        const el = getInvisibleTagEl(scope, value)
        if (el) {
          tagWidths.push(el.getBoundingClientRect().width)
        }
      }
      context.set("tagWidths", tagWidths)
    },

    recalculateVisibleTags({context, prop}) {
      const result = calculateVisibleTags({
        availableWidth: context.get("availableTagWidth"),
        gap: prop("gap"),
        indicatorWidth: context.get("overflowTagWidth"),
        minInputWidth: prop("minInputWidth"),
        tagWidths: context.get("tagWidths"),
      })
      context.set("visibleTagIndices", result.visibleIndices)
    },
  })
