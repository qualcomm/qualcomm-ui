// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {getPlacementStyles} from "@qualcomm-ui/dom/floating-ui"
import {
  getEventKey,
  getEventPoint,
  getEventTarget,
  isAnchorElement,
  isContextMenuEvent,
  isDownloadingEvent,
  isEditableElement,
  isModifierKey,
  isOpeningInNewTab,
  isPrintableKey,
  isSelfTarget,
  isValidTabEvent,
} from "@qualcomm-ui/dom/query"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import {cast} from "@qualcomm-ui/utils/functions"
import {hasProp} from "@qualcomm-ui/utils/guard"
import type {
  EventKeyMap,
  JSX,
  Machine,
  PropNormalizer,
} from "@qualcomm-ui/utils/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {
  domIds,
  getGroupId,
  getGroupLabelId,
  getItemEl,
  getItemId,
  isTargetDisabled,
  itemSelectEvent,
} from "./internal"
import type {
  GetOptionItemPropsReturn,
  ItemProps,
  ItemState,
  MenuApi,
  MenuArrowBindings,
  MenuArrowTipBindings,
  MenuCommonBindings,
  MenuContentBindings,
  MenuContextTriggerBindings,
  MenuItemBindings,
  MenuItemGroupBindings,
  MenuItemGroupLabelBindings,
  MenuItemIndicatorBindings,
  MenuItemLabelBindings,
  MenuOptionItemBindings,
  MenuOptionItemControlBindings,
  MenuPositionerBindings,
  MenuSchema,
  MenuSeparatorBindings,
  MenuTriggerBindings,
  MenuTriggerItemBindings,
  OptionItemProps,
  OptionItemState,
} from "./menu.types"

export function createMenuApi(
  machine: Machine<MenuSchema>,
  normalize: PropNormalizer,
): MenuApi {
  const {computed, context, prop, scope, send, state} = machine

  const commonBindings: MenuCommonBindings = {
    "data-scope": "menu",
    dir: prop("dir"),
  }

  const open = state.hasTag("open")

  const composite = prop("composite")

  const currentPlacement = context.get("currentPlacement")
  const anchorPoint = context.get("anchorPoint")
  const highlightedValue = context.get("highlightedValue")

  const popperStyles = getPlacementStyles({
    ...prop("positioning"),
    placement: anchorPoint ? "bottom" : currentPlacement,
  })

  function getItemState(props: ItemProps): ItemState {
    return {
      disabled: !!props.disabled,
      highlighted: highlightedValue === props.value && !!props.value,
      id: getItemId(scope, props.value),
    }
  }

  function getOptionItemProps(
    props: OptionItemProps,
  ): GetOptionItemPropsReturn {
    const valueText = props.valueText ?? props.value
    return {...props, id: props.value, valueText}
  }

  function getOptionItemState(props: OptionItemProps): OptionItemState {
    const itemState = getItemState(getOptionItemProps(props))
    return {
      ...itemState,
      checked: !!props.checked,
    }
  }

  function getItemBindings(props: ItemProps): MenuItemBindings {
    const {closeOnSelect, value, valueText} = props
    const itemState = getItemState(props)
    const id = getItemId(scope, value)
    return normalize.element({
      ...commonBindings,
      "aria-disabled": booleanAriaAttr(itemState.disabled),
      "data-disabled": booleanDataAttr(itemState.disabled),
      "data-focus-visible": booleanDataAttr(
        itemState.highlighted && context.get("itemFocusVisible"),
      ),
      "data-highlighted": booleanDataAttr(itemState.highlighted),
      "data-ownedby": domIds.content(scope),
      "data-part": "item",
      "data-value": value,
      "data-valuetext": valueText,
      id,
      onClick(event) {
        if (isDownloadingEvent(event)) {
          return
        }
        if (isOpeningInNewTab(event)) {
          return
        }
        if (itemState.disabled) {
          return
        }

        const target = event.currentTarget
        send({closeOnSelect, id, target, type: "ITEM_CLICK"})
      },
      onDragStart(event) {
        const isLink = event.currentTarget.matches("a[href]")
        if (isLink) {
          event.preventDefault()
        }
      },
      onPointerDown(event) {
        if (itemState.disabled) {
          return
        }
        const target = event.currentTarget
        send({closeOnSelect, id, target, type: "ITEM_POINTERDOWN"})
      },
      onPointerLeave(event) {
        if (itemState.disabled) {
          return
        }
        if (event.pointerType !== "mouse") {
          return
        }

        const pointerMoved = machine.event.previous()?.type.includes("POINTER")
        if (!pointerMoved) {
          return
        }

        const target = event.currentTarget
        send({closeOnSelect, id, target, type: "ITEM_POINTERLEAVE"})
      },
      onPointerMove(event) {
        if (itemState.disabled) {
          return
        }
        if (event.pointerType !== "mouse") {
          return
        }
        const target = event.currentTarget
        if (itemState.highlighted) {
          return
        }
        send({closeOnSelect, id, target, type: "ITEM_POINTERMOVE"})
      },
      role: "menuitem",
      tabIndex: -1,
    })
  }

  return {
    addItemListener(props) {
      const node = scope.getById(props.id)
      if (!node) {
        return
      }
      const listener = () => props.onSelect?.()
      node.addEventListener(itemSelectEvent, listener)
      return () => node.removeEventListener(itemSelectEvent, listener)
    },
    highlightedValue,
    open,
    reposition(options = {}) {
      send({options, type: "POSITIONING.SET"})
    },

    setChild(child) {
      send({id: child.prop("id")!, type: "CHILD.SET", value: child})
    },
    setHighlightedValue(value) {
      send({type: "HIGHLIGHTED.SET", value})
    },
    setOpen(nextOpen) {
      const open = state.hasTag("open")
      if (open === nextOpen) {
        return
      }
      send({type: nextOpen ? "OPEN" : "CLOSE"})
    },
    setParent(parent) {
      send({id: parent.prop("id")!, type: "PARENT.SET", value: parent})
    },

    // group: prop getters
    getArrowBindings(): MenuArrowBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "arrow",
        style: popperStyles.arrow,
      })
    },

    getArrowTipBindings(): MenuArrowTipBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "arrow-tip",
        style: popperStyles.arrowTip,
      })
    },

    getContentBindings(props): MenuContentBindings {
      scope.ids.set("content", props.id)
      return normalize.element({
        ...commonBindings,
        "aria-activedescendant": computed("highlightedId") || undefined,
        "aria-labelledby": domIds.trigger(scope),
        "data-from": context.get("anchorPoint") ? "context-trigger" : "trigger",
        "data-part": "content",
        "data-placement": currentPlacement,
        "data-state": open ? "open" : "closed",
        hidden: !open,
        id: domIds.content(scope),
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          if (!isSelfTarget(event)) {
            return
          }

          const target = getEventTarget<Element>(event)

          const sameMenu =
            target?.closest("[role=menu]") === event.currentTarget ||
            target === event.currentTarget
          if (!sameMenu) {
            return
          }

          if (event.key === "Tab") {
            const valid = isValidTabEvent(event)
            if (!valid) {
              event.preventDefault()
              return
            }
          }

          const item = getItemEl(scope, highlightedValue)
          const keyMap: EventKeyMap = {
            ArrowDown() {
              send({type: "ARROW_DOWN"})
            },
            ArrowLeft() {
              send({type: "ARROW_LEFT"})
            },
            ArrowRight() {
              send({type: "ARROW_RIGHT"})
            },
            ArrowUp() {
              send({type: "ARROW_UP"})
            },
            End() {
              send({type: "END"})
            },
            Enter() {
              send({type: "ENTER"})

              if (highlightedValue == null) {
                return
              }

              if (isAnchorElement(item)) {
                prop("navigate")?.({
                  href: item.href,
                  node: item,
                  value: highlightedValue,
                })
              }
            },
            Home() {
              send({type: "HOME"})
            },
            Space(event) {
              if (computed("isTypingAhead")) {
                send({key: event.key, type: "TYPEAHEAD"})
              } else {
                keyMap.Enter?.(event)
              }
            },
          }

          const key = getEventKey(event, {dir: prop("dir")})
          const exec = keyMap[key]

          if (exec) {
            exec(event as JSX.KeyboardEvent<HTMLElement>)
            event.stopPropagation()
            event.preventDefault()
            return
          }

          // typeahead
          if (!prop("typeahead")) {
            return
          }
          if (!isPrintableKey(event)) {
            return
          }
          if (isModifierKey(event)) {
            return
          }
          if (isEditableElement(target)) {
            return
          }

          send({key: event.key, type: "TYPEAHEAD"})
          event.preventDefault()
        },
        onPointerEnter(event) {
          if (event.pointerType !== "mouse") {
            return
          }
          send({type: "MENU_POINTERENTER"})
        },
        role: composite ? "menu" : "dialog",
        tabIndex: 0,
      })
    },

    getContextTriggerBindings(props): MenuContextTriggerBindings {
      scope.ids.register("contextTrigger", props)
      return normalize.element({
        ...commonBindings,
        "data-part": "context-trigger",
        id: props.id,
        onContextMenu(event) {
          const point = getEventPoint(event)
          send({point, type: "CONTEXT_MENU"})
          event.preventDefault()
        },
        onPointerCancel(event) {
          if (event.pointerType === "mouse") {
            return
          }
          send({type: "CONTEXT_MENU_CANCEL"})
        },
        onPointerDown(event) {
          if (event.pointerType === "mouse") {
            return
          }
          const point = getEventPoint(event)
          send({point, type: "CONTEXT_MENU_START"})
        },
        onPointerMove(event) {
          if (event.pointerType === "mouse") {
            return
          }
          send({type: "CONTEXT_MENU_CANCEL"})
        },
        onPointerUp(event) {
          if (event.pointerType === "mouse") {
            return
          }
          send({type: "CONTEXT_MENU_CANCEL"})
        },
        style: {
          userSelect: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
        },
      })
    },

    getItemBindings,

    getItemGroupBindings(props): MenuItemGroupBindings {
      return normalize.element({
        ...commonBindings,
        "aria-labelledby": getGroupLabelId(scope, props.id),
        "data-part": "item-group",
        id: getGroupId(scope, props.id),
        role: "group",
      })
    },

    getItemGroupLabelBindings(props): MenuItemGroupLabelBindings {
      return normalize.element({
        ...commonBindings,
        "data-part": "item-group-label",
        id: getGroupLabelId(scope, props.htmlFor),
      })
    },

    getItemIndicatorBindings(props): MenuItemIndicatorBindings {
      const itemState = getOptionItemState(cast(props))
      const dataState = itemState.checked ? "checked" : "unchecked"
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-highlighted": booleanDataAttr(itemState.highlighted),
        "data-part": "item-indicator",
        "data-state": hasProp(props, "checked") ? dataState : undefined,
        hidden: hasProp(props, "checked") ? !itemState.checked : undefined,
      })
    },

    getItemLabelBindings(props): MenuItemLabelBindings {
      const itemState = getOptionItemState(cast(props))
      const dataState = itemState.checked ? "checked" : "unchecked"
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-highlighted": booleanDataAttr(itemState.highlighted),
        "data-part": "item-text",
        "data-state": hasProp(props, "checked") ? dataState : undefined,
      })
    },

    getItemState,

    getOptionItemBindings(props): MenuOptionItemBindings {
      const {closeOnSelect, disabled, type} = props

      const option = getOptionItemProps(props)
      const itemState = getOptionItemState(props)

      return {
        ...getItemBindings(option),
        ...normalize.element({
          ...commonBindings,
          "aria-checked": booleanAriaAttr(itemState.checked),
          "data-state": itemState.checked ? "checked" : "unchecked",
          "data-type": type,
          "data-value": option.value,
          dir: prop("dir"),
          onClick(event) {
            if (disabled) {
              return
            }
            if (isDownloadingEvent(event)) {
              return
            }
            if (isOpeningInNewTab(event)) {
              return
            }
            const target = event.currentTarget
            send({
              closeOnSelect,
              option: {
                ...option,
                // angular fix for stale closure issue
                checked:
                  cast<HTMLButtonElement>(target).getAttribute("data-state") ===
                  "checked",
              },
              target,
              type: "ITEM_CLICK",
            })
          },
          role: `menuitem${type}`,
        } as MenuOptionItemBindings),
      }
    },

    getOptionItemControlBindings(props): MenuOptionItemControlBindings {
      const itemState = getOptionItemState(props)
      return normalize.element({
        ...commonBindings,
        "data-disabled": booleanDataAttr(itemState.disabled),
        "data-part": "item-control",
        "data-state": itemState.checked ? "checked" : "unchecked",
      })
    },

    getOptionItemState,

    getPositionerBindings(props): MenuPositionerBindings {
      scope.ids.set("positioner", props.id)
      return normalize.element({
        ...commonBindings,
        "data-part": "positioner",
        id: props.id,
        style: popperStyles.floating,
      })
    },

    getSeparatorBindings(): MenuSeparatorBindings {
      return normalize.element({
        ...commonBindings,
        "aria-orientation": "horizontal",
        "data-part": "separator",
        role: "separator",
      })
    },

    getTriggerBindings(props): MenuTriggerBindings {
      scope.ids.set("trigger", props.id)
      return normalize.button({
        ...commonBindings,
        "aria-controls": domIds.content(scope),
        "aria-expanded": booleanAriaAttr(open),
        "aria-haspopup": composite ? "menu" : "dialog",
        "data-part": computed("isSubmenu") ? "trigger-item" : "trigger",
        "data-placement": context.get("currentPlacement"),
        "data-state": open ? "open" : "closed",
        "data-uid": prop("id")!,
        id: props.id,
        onBlur() {
          send({type: "TRIGGER_BLUR"})
        },
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          if (isTargetDisabled(event.currentTarget)) {
            return
          }
          send({target: event.currentTarget, type: "TRIGGER_CLICK"})
        },
        onFocus() {
          send({type: "TRIGGER_FOCUS"})
        },
        onKeyDown(event) {
          if (event.defaultPrevented) {
            return
          }
          const keyMap: EventKeyMap = {
            ArrowDown() {
              send({type: "ARROW_DOWN"})
            },
            ArrowUp() {
              send({type: "ARROW_UP"})
            },
            Enter() {
              send({src: "enter", type: "ARROW_DOWN"})
            },
            Space() {
              send({src: "space", type: "ARROW_DOWN"})
            },
          }

          const key = getEventKey(event, {
            dir: prop("dir"),
            orientation: "vertical",
          })
          const exec = keyMap[key]

          if (exec) {
            event.preventDefault()
            exec(event as JSX.KeyboardEvent<HTMLElement>)
          }
        },
        onPointerDown(event) {
          if (isTargetDisabled(event.currentTarget)) {
            return
          }
          if (isContextMenuEvent(event)) {
            return
          }
          event.preventDefault()
        },
        onPointerLeave(event) {
          if (isTargetDisabled(event.currentTarget)) {
            return
          }
          if (event.pointerType !== "mouse") {
            return
          }
          if (!computed("isSubmenu")) {
            return
          }
          const point = getEventPoint(event)
          send({
            point,
            target: event.currentTarget,
            type: "TRIGGER_POINTERLEAVE",
          })
        },
        onPointerMove(event) {
          if (event.pointerType !== "mouse") {
            return
          }
          const disabled = isTargetDisabled(event.currentTarget)
          if (disabled || !computed("isSubmenu")) {
            return
          }
          const point = getEventPoint(event)
          send({
            point,
            target: event.currentTarget,
            type: "TRIGGER_POINTERMOVE",
          })
        },
        type: "button",
      })
    },

    getTriggerItemBindings(childApi, props): MenuTriggerItemBindings {
      const triggerProps = childApi.getTriggerBindings(props)
      return mergeProps(getItemBindings({value: triggerProps.id}), triggerProps)
    },
  }
}
