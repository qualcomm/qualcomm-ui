// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackElementSize} from "@qualcomm-ui/dom/element-size"
import {raf} from "@qualcomm-ui/dom/query"
import {ensureProps} from "@qualcomm-ui/utils/guard"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {calculateVisibleTags} from "./input-tags.overflow"
import type {InputTagsSchema} from "./input-tags.types"
import {
  getControlEl,
  getInputElement,
  getInvisibleTagEl,
  getMeasureIndicatorEl,
} from "./internal"

export const inputTagsMachine: MachineConfig<InputTagsSchema> =
  createMachine<InputTagsSchema>({
    actions: {
      dismissTag({event, prop}) {
        const eventValue =
          event.type === "INPUT_TAG.DISMISS" ? event.value : null
        if (!eventValue) {
          return
        }
        prop("onSelectValue")(eventValue)
      },

      measureIndicator({context, scope}) {
        const el = getMeasureIndicatorEl(scope)
        if (el) {
          context.set("indicatorWidth", el.getBoundingClientRect().width)
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

      recalculate({context, prop}) {
        const result = calculateVisibleTags({
          availableWidth: context.get("availableWidth"),
          gap: prop("gap"),
          indicatorWidth: context.get("indicatorWidth"),
          minInputWidth: prop("minInputWidth"),
          tagWidths: context.get("tagWidths"),
        })
        context.set("visibleIndices", result.visibleIndices)
      },
    },

    computed: {
      empty: ({prop}) => {
        const values = prop("value")
        return !values?.length
      },
      hasOverflow: ({computed}) => {
        return computed("overflowCount") > 0
      },

      overflowCount: ({context, prop}) => {
        const values = prop("value")
        const total = values?.length ?? 0
        return Math.max(0, total - context.get("visibleIndices").length)
      },

      showSelectionCount: ({prop}) => !!prop("open"),

      visibleTags: ({context, prop}) => {
        const values = prop("value") ?? []
        const indices = context.get("visibleIndices")
        return indices.map((i) => values[i]).filter(Boolean)
      },
    },

    context({bindable}) {
      return {
        availableWidth: bindable<number>(() => ({
          defaultValue: 0,
        })),
        indicatorWidth: bindable<number>(() => ({
          defaultValue: 0,
        })),
        tagWidths: bindable<number[]>(() => ({
          defaultValue: [],
          hash: (v) => v.join(","),
          sync: true,
        })),
        visibleIndices: bindable<number[]>(() => ({
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
            context.set("availableWidth", availableWidth)
            send({type: "REMEASURE"})
          }
        })
      },
    },

    ids: ({bindableId, ids}) => ({
      container: bindableId(ids?.container),
      indicator: bindableId(ids?.indicator),
      invisibleTagsContainer: bindableId(ids?.invisibleTagsContainer),
    }),

    initialState() {
      return "idle"
    },

    on: {
      "INPUT_TAG.DISMISS": {
        actions: ["dismissTag"],
      },
      REMEASURE: {
        actions: ["measureTags", "measureIndicator", "recalculate"],
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
        minInputWidth: 50,
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
  })
