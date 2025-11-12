// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackElementRect} from "@qualcomm-ui/dom/dom-query"
import {trackMutation} from "@qualcomm-ui/dom/element-size"
import {getFocusables, nextTick, raf} from "@qualcomm-ui/dom/query"
import {
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import {
  getContentEl,
  getFirstTriggerEl,
  getIndicatorEl,
  getLastTriggerEl,
  getListEl,
  getNextTriggerEl,
  getOffsetRect,
  getPrevTriggerEl,
  getRectById,
  getTabEl,
  resolveRect,
} from "./internal"
import type {TabsSchema} from "./tabs.types"

const {not} = createGuards<TabsSchema>()

export const tabsMachine: MachineConfig<TabsSchema> = createMachine<TabsSchema>(
  {
    actions: {
      allowIndicatorTransition({context}) {
        context.set("indicatorTransition", true)
      },
      cleanupListObserver({refs}) {
        const cleanup = refs.get("listObserverCleanup")
        if (cleanup) {
          cleanup()
        }
      },
      cleanupObserver({refs}) {
        const cleanup = refs.get("indicatorCleanup")
        if (cleanup) {
          cleanup()
        }
      },
      clearFocusedValue({context}) {
        context.set("focusedValue", null)
      },
      clearValue({context}) {
        context.set("value", null)
      },
      focusFirstTab({scope}) {
        raf(() => {
          getFirstTriggerEl(scope)?.focus()
        })
      },
      focusLastTab({scope}) {
        raf(() => {
          getLastTriggerEl(scope)?.focus()
        })
      },

      focusNextTab({context, event, prop, scope}) {
        const focusedValue = event.value ?? context.get("focusedValue")
        if (!focusedValue) {
          return
        }

        const triggerEl = getNextTriggerEl(scope, {
          loopFocus: prop("loopFocus"),
          value: focusedValue,
        })

        raf(() => {
          if (prop("composite")) {
            triggerEl?.focus()
          } else if (triggerEl?.dataset.value != null) {
            context.set("focusedValue", triggerEl.dataset.value)
          }
        })
      },

      focusPrevTab({context, event, prop, scope}) {
        const focusedValue = event.value ?? context.get("focusedValue")
        if (!focusedValue) {
          return
        }

        const triggerEl = getPrevTriggerEl(scope, {
          loopFocus: prop("loopFocus"),
          value: focusedValue,
        })

        raf(() => {
          if (prop("composite")) {
            triggerEl?.focus()
          } else if (triggerEl?.dataset.value != null) {
            context.set("focusedValue", triggerEl.dataset.value)
          }
        })
      },

      renderIndicator({context}) {
        context.set("indicatorRendered", true)
      },

      selectFocusedTab({context, prop}) {
        raf(() => {
          const focusedValue = context.get("focusedValue")
          if (!focusedValue) {
            return
          }
          const nullable =
            prop("deselectable") && context.get("value") === focusedValue
          const value = nullable ? null : focusedValue
          context.set("value", value)
        })
      },
      setFocusedValue({context, event, flush}) {
        if (event.value == null) {
          return
        }
        flush(() => {
          if (event.focusVisible) {
            context.set("focusVisible", true)
          }
          context.set("focusedValue", event.value)
        })
      },
      setIndicatorRect({context, event, scope}) {
        const value = event.id ?? context.get("value")

        const indicatorEl = getIndicatorEl(scope)
        if (!indicatorEl) {
          return
        }

        if (!value) {
          context.set("indicatorTransition", false)
          return
        }

        const tabEl = getTabEl(scope, value)
        if (!tabEl) {
          return
        }

        context.set("indicatorRect", getRectById(scope, value))

        nextTick(() => {
          context.set("indicatorTransition", false)
        })
      },
      setValue({context, event, prop}) {
        const nullable =
          prop("deselectable") &&
          context.get("value") === context.get("focusedValue")
        context.set("value", nullable ? null : event.value)
      },
      syncFocusVisible({context, event}) {
        /**
         * Tab focus state is virtual and therefore does not emit the browser's
         * native focus-visible events. We track it separately for that reason.
         */
        const eventType = event.type as string
        context.set(
          "focusVisible",
          eventType
            ? eventType.startsWith("ARROW") ||
                ["END", "HOME"].includes(eventType)
            : false,
        )
      },
      syncIndicatorRect({context, refs, scope}) {
        const cleanup = refs.get("indicatorCleanup")
        if (cleanup) {
          cleanup()
        }

        const value = context.get("value")
        if (!value) {
          context.set("indicatorTransition", false)
          return
        }

        const tabEl = getTabEl(scope, value)
        const indicatorEl = getIndicatorEl(scope)
        if (!tabEl || !indicatorEl) {
          return
        }

        const indicatorCleanup = trackElementRect([tabEl], {
          measure(el) {
            return getOffsetRect(el)
          },
          onEntry({rects}) {
            const [rect] = rects
            context.set("indicatorRect", resolveRect(rect))
          },
        })

        refs.set("indicatorCleanup", indicatorCleanup)
      },
      syncTabIndex({context, scope}) {
        raf(() => {
          const value = context.get("value")
          if (!value) {
            return
          }

          const contentEl = getContentEl(scope, value)
          if (!contentEl) {
            return
          }

          const focusables = getFocusables(contentEl)
          if (focusables.length > 0) {
            contentEl.removeAttribute("tabindex")
          } else {
            contentEl.setAttribute("tabindex", "0")
          }
        })
      },
    },
    context({bindable, prop}) {
      return {
        focusedValue: bindable(() => ({
          defaultValue: prop("value") || prop("defaultValue"),
          onChange(value) {
            prop("onFocusChange")?.(value!)
          },
          sync: true,
        })),
        focusVisible: bindable(() => ({
          defaultValue: false,
        })),
        indicatorRect: bindable(() => ({
          defaultValue: {height: "0px", left: "0px", top: "0px", width: "0px"},
        })),
        indicatorRendered: bindable(() => ({
          defaultValue: false,
        })),
        indicatorTransition: bindable(() => ({defaultValue: false})),
        ssr: bindable(() => ({defaultValue: true})),
        value: bindable(() => ({
          defaultValue: prop("defaultValue"),
          onChange(value) {
            prop("onValueChange")?.(value!)
          },
          value: prop("value"),
        })),
      }
    },
    effects: {
      trackTabListElement: (params) => {
        const {actions, refs, scope} = params
        const cleanup = refs.get("listObserverCleanup")
        if (cleanup) {
          cleanup()
        }

        const listEl = getListEl(scope)
        if (!listEl) {
          return
        }

        const listCleanup = trackMutation(
          listEl,
          () => {
            // sync the indicator when tabs are added or removed
            actions.syncIndicatorRect(params)
          },
          {childList: true},
        )

        refs.set("listObserverCleanup", listCleanup)
      },
    },
    guards: {
      isIndicatorRendered: ({context}) => context.get("indicatorRendered"),
      selectOnFocus: ({prop}) => prop("activationMode") === "automatic",
    },
    ids: ({bindableId, bindableIdCollection}) => {
      return {
        dismissButton: bindableIdCollection(),
        indicator: bindableId(),
        list: bindableId(),
        panel: bindableIdCollection(),
        tabButton: bindableIdCollection(),
      }
    },
    initialState() {
      return "idle"
    },
    on: {
      CLEAR_VALUE: {
        actions: ["clearValue"],
      },
      SET_INDICATOR_RECT: {
        actions: ["setIndicatorRect"],
      },
      SET_VALUE: {
        actions: ["setValue"],
      },
      SYNC_TAB_INDEX: {
        actions: ["syncTabIndex"],
      },
      TAB_MOUSE_ENTER: {
        actions: ["renderIndicator", "syncIndicatorRect"],
        guard: not("isIndicatorRendered"),
      },
    },
    onDestroy: {
      actions: ["cleanupObserver", "cleanupListObserver"],
    },
    onInit: {
      actions: ["syncIndicatorRect", "syncTabIndex"],
      effects: ["trackTabListElement"],
    },
    props({props}) {
      return {
        activationMode: "automatic",
        composite: true,
        defaultValue: null,
        dir: "ltr",
        loopFocus: true,
        orientation: "horizontal",
        ...props,
      }
    },
    refs() {
      return {
        indicatorCleanup: () => {},
        listObserverCleanup: () => {},
      }
    },
    states: {
      focused: {
        on: {
          ARROW_NEXT: [
            {
              actions: ["syncFocusVisible", "focusNextTab", "selectFocusedTab"],
              guard: "selectOnFocus",
            },
            {
              actions: ["syncFocusVisible", "focusNextTab"],
            },
          ],
          ARROW_PREV: [
            {
              actions: ["syncFocusVisible", "focusPrevTab", "selectFocusedTab"],
              guard: "selectOnFocus",
            },
            {
              actions: ["syncFocusVisible", "focusPrevTab"],
            },
          ],
          END: [
            {
              actions: ["syncFocusVisible", "focusLastTab", "selectFocusedTab"],
              guard: "selectOnFocus",
            },
            {
              actions: ["syncFocusVisible", "focusLastTab"],
            },
          ],
          HOME: [
            {
              actions: [
                "syncFocusVisible",
                "focusFirstTab",
                "selectFocusedTab",
              ],
              guard: "selectOnFocus",
            },
            {
              actions: ["syncFocusVisible", "focusFirstTab"],
            },
          ],
          TAB: {
            actions: ["syncFocusVisible"],
          },
          TAB_BLUR: {
            actions: ["clearFocusedValue"],
            target: "idle",
          },
          TAB_CLICK: [
            {
              actions: [
                "setFocusedValue",
                "setValue",
                "renderIndicator",
                "syncIndicatorRect",
              ],
              guard: not("isIndicatorRendered"),
            },
            {
              actions: ["setFocusedValue", "setValue"],
            },
          ],
          TAB_FOCUS: {
            actions: ["setFocusedValue"],
          },
          TAB_MOUSE_DOWN: {
            actions: ["syncFocusVisible"],
          },
        },
      },
      idle: {
        on: {
          TAB_CLICK: [
            {
              actions: [
                "setFocusedValue",
                "setValue",
                "renderIndicator",
                "syncIndicatorRect",
              ],
              guard: not("isIndicatorRendered"),
              target: "focused",
            },
            {
              actions: ["setFocusedValue", "setValue"],
              target: "focused",
            },
          ],
          TAB_FOCUS: {
            actions: ["setFocusedValue"],
            target: "focused",
          },
          TAB_MOUSE_DOWN: {
            actions: ["syncFocusVisible"],
          },
        },
      },
    },
    watch({action, context, prop, track}) {
      track([() => context.get("value")], () => {
        action([
          "allowIndicatorTransition",
          "syncIndicatorRect",
          "syncTabIndex",
        ])
      })
      track([() => prop("dir"), () => prop("orientation")], () => {
        action(["syncIndicatorRect"])
      })
      track([() => context.get("focusedValue")], () => {
        if (!context.get("focusedValue")) {
          context.set("focusVisible", false)
        }
      })
    },
  },
)
