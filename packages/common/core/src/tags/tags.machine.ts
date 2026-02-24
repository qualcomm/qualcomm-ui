// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackElementSize} from "@qualcomm-ui/dom/element-size"
import {raf} from "@qualcomm-ui/dom/query"
import {ensureProps} from "@qualcomm-ui/utils/guard"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"

import {getControlEl, getMeasureIndicatorEl, getTagEl} from "./internal"
import {calculateVisibleTags} from "./tags.overflow"
import type {TagsSchema} from "./tags.types"

export const tagsMachine: MachineConfig<TagsSchema> = createMachine<TagsSchema>(
  {
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
          const el = getTagEl(scope, value)
          if (el) {
            tagWidths.push(el.getBoundingClientRect().width)
          }
        }
        context.set("tagWidths", tagWidths)
      },

      recalculate({context, prop}) {
        const result = calculateVisibleTags({
          containerWidth: context.get("containerWidth"),
          gap: prop("gap"),
          indicatorWidth: context.get("indicatorWidth"),
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
        containerWidth: bindable<number>(() => ({
          defaultValue: 0,
        })),
        indicatorWidth: bindable<number>(() => ({
          defaultValue: 0,
        })),
        tagWidths: bindable<number[]>(() => ({
          defaultValue: [],
          hash: (v) => v.join(","),
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
            context.set("containerWidth", size.width)
            send({type: "REMEASURE"})
          }
        })
      },
    },

    ids: ({bindableId, ids}) => ({
      container: bindableId(ids?.container),
      indicator: bindableId(ids?.indicator),
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
        ids: {},
        ...props,
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
  },
)
