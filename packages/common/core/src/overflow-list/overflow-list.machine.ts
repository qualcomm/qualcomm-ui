// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import {
  domEls,
  getItemEl,
  trackRootLayout,
} from "./internal/overflow-list.dom.js"
import {getOverflowFit} from "./internal/overflow-list.utils.js"
import type {
  OverflowListFit,
  OverflowListSchema,
} from "./overflow-list.types.js"

const overflowListMachineBase = {
  computed: {
    hiddenCount: ({computed, context, prop}) =>
      computed("overflowing") && !context.get("expanded")
        ? Math.max(0, prop("count") - context.get("fit").visibleCount)
        : 0,
    overflowing: ({context}) => context.get("fit").overflowing,
  },

  context({bindable, prop}) {
    return {
      expanded: bindable<boolean>(() => ({
        defaultValue: prop("defaultExpanded"),
        onChange(value) {
          prop("onExpandedChange")?.(value)
        },
        value: prop("expanded"),
      })),
      /**
       * Synchronous, so that a measurement from an observer renders before the
       * browser paints the previous fit.
       */
      fit: bindable<OverflowListFit>(() => ({
        defaultValue: {overflowing: false, visibleCount: 0},
        hash: (fit) => `${fit.overflowing}:${fit.visibleCount}`,
        sync: true,
      })),
    }
  },

  effects: {
    trackLayout({refs, send}) {
      send({type: "MEASURE"})
      return () => {
        refs.get("stopObserving")?.()
        refs.set("stopObserving", undefined)
        refs.set("observedRoot", null)
      }
    },
  },

  ids: ({bindableId, ids}) => ({
    indicator: bindableId(ids?.indicator),
    root: bindableId(ids?.root),
  }),

  initialState() {
    return "idle" as const
  },

  on: {
    "EXPANDED.SET": {
      actions: ["setExpanded"],
    },
    "EXPANDED.TOGGLE": {
      actions: ["toggleExpanded"],
    },
    MEASURE: {
      actions: ["observeLayout", "measure"],
    },
  },

  onInit: {
    effects: ["trackLayout"],
  },

  props({props}) {
    return {
      count: 0,
      defaultExpanded: false,
      dir: "ltr",
      maxRows: 1,
      reservedWidth: 0,
      ...props,
    }
  },

  refs() {
    return {
      indicatorWidth: 0,
      observedRoot: null,
      stopObserving: undefined,
    }
  },

  states: {
    idle: {},
  },

  watch({prop, send, track}) {
    /**
     * Item changes also change the root's children, which the layout observer
     * already picks up. The measurement is deferred because a synchronous
     * render isn't allowed from within the framework's effects.
     */
    track(
      [() => prop("count"), () => prop("maxRows"), () => prop("reservedWidth")],
      () => {
        queueMicrotask(() => send({type: "MEASURE"}))
      },
    )
  },
} satisfies MachineConfigBase<OverflowListSchema>

export const overflowListMachine: MachineConfig<OverflowListSchema> =
  createNarrowedMachine<OverflowListSchema>()(overflowListMachineBase, {
    actions: {
      measure({context, prop, refs, scope}) {
        const root = domEls.root(scope)
        if (!root) {
          return
        }
        const style = scope.getWin().getComputedStyle(root)
        const availableWidth =
          root.clientWidth -
          (parseFloat(style.paddingInlineStart) || 0) -
          (parseFloat(style.paddingInlineEnd) || 0)
        const itemWidths = Array.from(
          {length: prop("count")},
          (_, index) =>
            getItemEl(scope, index)?.getBoundingClientRect().width ?? 0,
        )

        /**
         * The indicator's expanded label, such as "Show less", would skew the
         * collapsed fit, so its width is only taken while collapsed.
         */
        const indicator = domEls.indicator(scope)
        if (
          indicator &&
          (!context.get("expanded") || refs.get("indicatorWidth") === 0)
        ) {
          refs.set("indicatorWidth", indicator.getBoundingClientRect().width)
        }

        context.set(
          "fit",
          getOverflowFit({
            availableWidth,
            gap: parseFloat(style.columnGap) || 0,
            indicatorWidth: refs.get("indicatorWidth"),
            itemWidths,
            maxRows: prop("maxRows"),
            reservedWidth: prop("reservedWidth"),
          }),
        )
      },

      /**
       * The root can mount after the machine starts, for example when a list
       * renders nothing while empty, so observers attach whenever the root
       * element changes.
       */
      observeLayout({refs, scope, send}) {
        const root = domEls.root(scope)
        if (root === refs.get("observedRoot")) {
          return
        }
        refs.get("stopObserving")?.()
        refs.set("observedRoot", root)
        refs.set(
          "stopObserving",
          root
            ? trackRootLayout(root, () => send({type: "MEASURE"}))
            : undefined,
        )
      },

      setExpanded({context, event}) {
        context.set("expanded", event.value)
      },

      toggleExpanded({context}) {
        context.set("expanded", !context.get("expanded"))
      },
    },
  })
