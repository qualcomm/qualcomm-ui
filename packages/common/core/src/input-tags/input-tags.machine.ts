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
      measureIndicator({context, scope}) {
        const el = getMeasureIndicatorEl(scope)
        if (el) {
          context.set("indicatorWidth", el.getBoundingClientRect().width)
        }
      },

      measureTags({context, prop, scope}) {
        const values = prop("parent").context.get("value") ?? []
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
        context.set("visibleCount", result.visibleCount)
      },
    },

    computed: {
      empty: ({prop}) => {
        const values = prop("parent").context.get("value")
        return !values?.length
      },

      hasOverflow: ({context, prop}) => {
        const values = prop("parent").context.get("value")
        const total = values?.length ?? 0
        return total > context.get("visibleCount")
      },

      overflowCount: ({context, prop}) => {
        const values = prop("parent").context.get("value")
        const total = values?.length ?? 0
        return Math.max(0, total - context.get("visibleCount"))
      },

      values: ({prop}) => {
        return prop("parent").context.get("value") ?? []
      },

      visibleTags: ({context, prop}) => {
        const values = prop("parent").context.get("value") ?? []
        return values.slice(0, context.get("visibleCount"))
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
        visibleCount: bindable<number>(() => ({
          defaultValue: 0,
        })),
      }
    },

    effects: {
      trackControlResize({context, scope, send}) {
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
            const availableWidth =
              inputElementRect.right - controlElementRect.left
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
      REMEASURE: {
        actions: ["measureTags", "measureIndicator", "recalculate"],
      },
    },

    props({props}) {
      ensureProps(props, ["parent"], "tags")
      return {
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

    watch({prop, send, track}) {
      track([() => JSON.stringify(prop("parent").context.get("value"))], () => {
        raf(() => {
          send({type: "REMEASURE"})
        })
      })
    },
  })
