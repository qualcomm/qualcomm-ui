// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  getEventKey,
  isComposingEvent,
  isOpeningInNewTab,
  isSafari,
  isSelfTarget,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {
  EventKeyMap,
  IdRegistrationProps,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"

import {getTabButtonEl, tabsDomIds} from "./internal"
import type {
  PanelProps,
  TabDismissButtonApiProps,
  TabProps,
  TabsApi,
  TabsCommonBindings,
  TabsIndicatorBindings,
  TabsListBindings,
  TabsPanelBindings,
  TabsRootBindings,
  TabsSchema,
  TabsTabBindings,
  TabsTabButtonBindings,
  TabsTabDismissButtonBindings,
  TabState,
} from "./tabs.types"

export function createTabsApi(
  machine: Machine<TabsSchema>,
  normalize: PropNormalizer,
): TabsApi {
  const {context, prop, scope, send, state} = machine

  const translations = prop("translations")
  const focused = state.matches("focused")

  const isVertical = prop("orientation") === "vertical"
  const isHorizontal = prop("orientation") === "horizontal"
  const composite = prop("composite")

  const commonBindings: TabsCommonBindings = {
    "data-scope": "tabs",
    dir: prop("dir"),
  }

  function getTabState(props: TabProps): TabState {
    return {
      disabled: !!props.disabled,
      focused: context.get("focusedValue") === props.value,
      selected: context.get("value") === props.value,
    }
  }

  return {
    clearValue() {
      send({type: "CLEAR_VALUE"})
    },
    focus() {
      const value = context.get("value")
      if (!value) {
        return
      }
      getTabButtonEl(scope, value)?.focus()
    },
    focusedValue: context.get("focusedValue"),
    getTabState,
    setIndicatorRect(value) {
      const id = tabsDomIds.tabButton(scope, value)
      send({id, type: "SET_INDICATOR_RECT"})
    },
    setValue(value) {
      send({type: "SET_VALUE", value})
    },
    syncTabIndex() {
      send({type: "SYNC_TAB_INDEX"})
    },
    value: context.get("value"),

    // group: bindings
    getIndicatorBindings(props): TabsIndicatorBindings {
      scope.ids.register("indicator", props)
      const indicatorRect = context.get("indicatorRect")
      const indicatorTransition = context.get("indicatorTransition")

      return normalize.element({
        ...commonBindings,
        "data-focus": booleanDataAttr(!!context.get("focusedValue")),
        "data-focus-visible": booleanDataAttr(context.get("focusVisible")),
        "data-orientation": prop("orientation"),
        "data-part": "indicator",
        id: props.id,
        style: {
          "--height": indicatorRect.height,
          "--left": indicatorRect.left,
          "--top": indicatorRect.top,
          "--transition-property": "left, right, top, bottom, width, height",
          "--width": indicatorRect.width,
          [isHorizontal ? "left" : "top"]: isHorizontal
            ? "var(--left)"
            : "var(--top)",
          position: "absolute",
          transitionDuration: indicatorTransition
            ? "var(--transition-duration, 150ms)"
            : "0ms",
          transitionProperty: "var(--transition-property)",
          transitionTimingFunction: "var(--transition-timing-function)",
          willChange: "var(--transition-property)",
        },
      })
    },
    getListBindings(props): TabsListBindings {
      scope.ids.register("list", props)
      return normalize.element({
        ...commonBindings,
        "aria-label": translations?.listLabel,
        "aria-orientation": prop("orientation"),
        "data-focus": booleanDataAttr(focused),
        "data-orientation": prop("orientation"),
        "data-part": "list",
        id: props.id,
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }

          if (!isSelfTarget(event)) {
            return
          }
          if (isComposingEvent(event)) {
            return
          }

          const keyMap: EventKeyMap = {
            ArrowDown() {
              if (isHorizontal) {
                return
              }
              send({key: "ArrowDown", type: "ARROW_NEXT"})
            },
            ArrowLeft() {
              if (isVertical) {
                return
              }
              send({key: "ArrowLeft", type: "ARROW_PREV"})
            },
            ArrowRight() {
              if (isVertical) {
                return
              }
              send({key: "ArrowRight", type: "ARROW_NEXT"})
            },
            ArrowUp() {
              if (isHorizontal) {
                return
              }
              send({key: "ArrowUp", type: "ARROW_PREV"})
            },
            End() {
              send({type: "END"})
            },
            Home() {
              send({type: "HOME"})
            },
          }

          const key = getEventKey(event, {
            dir: prop("dir"),
            orientation: prop("orientation"),
          })

          const exec = keyMap[key]

          if (event.key === "Tab" && !event.defaultPrevented) {
            send({type: "TAB"})
          }

          if (exec) {
            event.preventDefault()
            exec(event)
            return
          }
        },
        role: "tablist",
      })
    },
    getPanelBindings(
      props: PanelProps & IdRegistrationProps,
    ): TabsPanelBindings {
      const {id, onDestroy, value} = props
      scope.ids.collection("panel").register(value, id, onDestroy)

      const selected = context.get("value") === value
      return normalize.element({
        ...commonBindings,
        "aria-labelledby": tabsDomIds.tabButton(scope, value)!,
        "data-orientation": prop("orientation"),
        "data-ownedby": tabsDomIds.list(scope),
        "data-part": "panel",
        "data-selected": booleanDataAttr(selected),
        hidden: !selected,
        id,
        role: "tabpanel",
        tabIndex: composite ? 0 : -1,
      })
    },
    getRootBindings(): TabsRootBindings {
      return normalize.element({
        ...commonBindings,
        "data-focus": booleanDataAttr(focused),
        "data-orientation": prop("orientation"),
        "data-part": "root",
      })
    },
    getTabBindings(): TabsTabBindings {
      return normalize.element({
        ...commonBindings,
        "data-orientation": prop("orientation"),
        "data-part": "tab",
      })
    },
    getTabButtonBindings(
      props: TabProps & IdRegistrationProps,
    ): TabsTabButtonBindings {
      const {disabled, id, onDestroy, value} = props
      scope.ids.collection("tabButton").register(value, id, onDestroy)
      const tabState = getTabState(props)
      return normalize.button({
        ...commonBindings,
        "aria-controls": tabState.selected
          ? tabsDomIds.panel(scope, value)
          : undefined,
        "aria-disabled": booleanAriaAttr(disabled),
        "aria-selected": booleanAriaAttr(tabState.selected),
        "data-disabled": booleanDataAttr(disabled),
        "data-focus": booleanDataAttr(tabState.focused),
        "data-focus-visible": booleanDataAttr(context.get("focusVisible")),
        "data-indicator-rendered": booleanDataAttr(
          context.get("indicatorRendered"),
        ),
        "data-orientation": prop("orientation"),
        "data-ownedby": tabsDomIds.list(scope),
        "data-part": "tab-button",
        "data-selected": booleanDataAttr(tabState.selected),
        "data-value": value,
        disabled,
        id,
        onBlur(event) {
          const target = event.relatedTarget as HTMLElement | null
          if (target?.getAttribute("role") !== "tab") {
            send({type: "TAB_BLUR"})
          }
        },
        onClick(event) {
          if (event.defaultPrevented || isOpeningInNewTab(event) || disabled) {
            return
          }
          if (isSafari()) {
            event.currentTarget.focus()
          }
          send({type: "TAB_CLICK", value})
        },
        onFocus() {
          send({focusVisible: isFocusVisible(), type: "TAB_FOCUS", value})
        },
        onMouseDown(event) {
          if (event.defaultPrevented || disabled) {
            return
          }
          send({type: "TAB_MOUSE_DOWN"})
        },
        onMouseEnter: () => {
          send({type: "TAB_MOUSE_ENTER"})
        },
        role: "tab",
        tabIndex: tabState.selected && composite ? 0 : -1,
        type: "button",
      })
    },
    getTabDismissButtonBindings(
      props: TabDismissButtonApiProps = {},
    ): TabsTabDismissButtonBindings {
      return normalize.button({
        ...commonBindings,
        "aria-label": props["aria-label"] || "Close",
        "data-part": "tab-dismiss-button",
        onClick(event) {
          event.stopPropagation()
        },
        role: "button",
        type: "button",
      })
    },
    getTabIconBindings() {
      return normalize.element({
        ...commonBindings,
        "data-part": "tab-icon",
      })
    },
  }
}
