// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {trackDismissableElement} from "@qualcomm-ui/dom/dismissable"
import {
  getPlacement,
  getPlacementSide,
  type Placement,
} from "@qualcomm-ui/dom/floating-ui"
import {
  addDomEvent,
  clickIfLink,
  contains,
  getByTypeahead,
  getEventTarget,
  getInitialFocus,
  isEditableElement,
  observeAttributes,
  raf,
  scrollIntoView,
} from "@qualcomm-ui/dom/query"
import {
  getElementPolygon,
  isPointInPolygon,
  type Point,
} from "@qualcomm-ui/dom/rect-utils"
import {isEqual} from "@qualcomm-ui/utils/equal"
import {
  createGuards,
  createMachine,
  type GuardFn,
  type Machine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import {
  dispatchSelectionEvent,
  domEls,
  domIds,
  getElemByKey,
  getFirstEl,
  getItemEl,
  getItemId,
  getItemValue,
  getLastEl,
  getNextEl,
  getPrevEl,
  isTriggerItem,
} from "./internal"
import type {MenuSchema, MenuScope} from "./menu.types"

const {and, not, or} = createGuards<MenuSchema>()

export const menuMachine: MachineConfig<MenuSchema> = createMachine<MenuSchema>(
  {
    actions: {
      clearHighlightedItem({context}) {
        context.set("highlightedValue", null)
      },
      clearIntentPolygon({context}) {
        context.set("intentPolygon", null)
      },
      clickHighlightedItem({computed, scope}) {
        const itemEl = scope.getById(computed("highlightedId")!)
        if (!itemEl || itemEl.dataset.disabled) {
          return
        }
        queueMicrotask(() => itemEl.click())
      },
      closeRootMenu({refs}) {
        closeRootMenu({parent: refs.get("parent")})
      },
      focusMenu({context, event, scope}) {
        raf(() => {
          const contentEl = domEls.content(scope)
          const initialFocusEl = getInitialFocus({
            enabled: !contains(contentEl, scope.getActiveElement()),
            filter(node) {
              return !node.role?.startsWith("menuitem")
            },
            root: contentEl,
          })
          if ("fromArrowKey" in event && event.fromArrowKey) {
            context.set("itemFocusVisible", true)
          }
          initialFocusEl?.focus({preventScroll: true})
        })
      },
      focusParentMenu({event, refs}) {
        refs.get("parent")?.send({
          fromArrowKey: event.type.startsWith("ARROW"),
          type: "FOCUS_MENU",
        })
      },
      focusTrigger({computed, context, event, scope}) {
        if (
          computed("isSubmenu") ||
          context.get("anchorPoint") ||
          ("restoreFocus" in event && event.restoreFocus === false)
        ) {
          return
        }
        queueMicrotask(() =>
          domEls.trigger(scope)?.focus({preventScroll: true}),
        )
      },
      highlightFirstItem({context, event, scope}) {
        // use raf in event content is lazy mounted
        const fn = domEls.content(scope) ? queueMicrotask : raf
        fn(() => {
          context.set(
            "itemFocusVisible",
            event.type.startsWith("ARROW") ||
              ("fromArrowKey" in event && event.fromArrowKey),
          )
          const first = getFirstEl(scope)
          if (!first) {
            return
          }
          context.set("highlightedValue", getItemValue(first))
        })
      },
      highlightLastItem({context, event, scope}) {
        // use raf in event content is lazy mounted
        const fn = domEls.content(scope) ? queueMicrotask : raf
        fn(() => {
          context.set("itemFocusVisible", event.type.startsWith("ARROW"))
          const last = getLastEl(scope)
          if (!last) {
            return
          }
          context.set("highlightedValue", getItemValue(last))
        })
      },
      highlightMatchedItem({context, event, refs, scope}) {
        const node = getElemByKey(scope, {
          key: "key" in event ? event.key : "",
          typeaheadState: refs.get("typeaheadState"),
          value: context.get("highlightedValue"),
        })
        if (!node) {
          return
        }
        context.set("highlightedValue", getItemValue(node))
        context.set("itemFocusVisible", event.type.startsWith("ARROW"))
      },
      highlightNextItem({context, event, prop, scope}) {
        const next = getNextEl(scope, {
          loop: "loop" in event ? event.loop : undefined,
          loopFocus: prop("loopFocus"),
          value: context.get("highlightedValue"),
        })
        context.set("highlightedValue", getItemValue(next))
        context.set("itemFocusVisible", event.type.startsWith("ARROW"))
      },
      highlightPrevItem({context, event, prop, scope}) {
        const prev = getPrevEl(scope, {
          loop: "loop" in event ? event.loop : undefined,
          loopFocus: prop("loopFocus"),
          value: context.get("highlightedValue"),
        })
        context.set("highlightedValue", getItemValue(prev))
        context.set("itemFocusVisible", event.type.startsWith("ARROW"))
      },
      invokeOnClose({prop}) {
        prop("onOpenChange")?.(false)
      },
      invokeOnOpen({prop}) {
        prop("onOpenChange")?.(true)
      },
      invokeOnSelect({context, prop, scope}) {
        const value = context.get("highlightedValue")
        if (value == null) {
          return
        }

        const node = getItemEl(scope, value)
        dispatchSelectionEvent(node, value)

        prop("onSelect")?.(value)
      },
      openSubmenu({computed, context, event, refs, scope}) {
        const item = scope.getById(computed("highlightedId")!)
        const id = item?.getAttribute("data-uid")
        const children = refs.get("children")
        const child = id ? children[id] : null
        context.set("itemFocusVisible", false)
        child?.send({
          fromArrowKey: event.type.startsWith("ARROW"),
          type: "OPEN_AUTOFOCUS",
        })
      },
      reposition({context, event, prop, refs, scope}) {
        const getMenuPositionerEl = () => domEls.positioner(scope)
        const anchorPoint = context.get("anchorPoint")
        const getAnchorRect = anchorPoint
          ? () => ({height: 0, width: 0, ...anchorPoint})
          : undefined

        const positioning = {
          ...prop("positioning"),
          ...refs.get("positioningOverride"),
        }

        getPlacement(domEls.trigger(scope), getMenuPositionerEl, {
          ...positioning,
          defer: true,
          getAnchorRect,
          ...("options" in event ? (event.options ?? {}) : {}),
          listeners: false,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },
      restoreHighlightedItem({context}) {
        if (!context.get("lastHighlightedValue")) {
          return
        }
        context.set("highlightedValue", context.get("lastHighlightedValue"))
        context.set("lastHighlightedValue", null)
      },
      restoreParentHighlightedItem({refs}) {
        refs.get("parent")?.send({type: "HIGHLIGHTED.RESTORE"})
      },
      resumePointer({flush, refs}) {
        const parent = refs.get("parent")
        if (!parent) {
          return
        }
        flush(() => {
          parent.context.set("suspendPointer", false)
        })
      },
      setAnchorPoint({context, event}) {
        if ("point" in event) {
          context.set("anchorPoint", (prev) => {
            return isEqual(prev, event.point) ? prev : event.point
          })
        }
      },
      setChildMenu({event, refs}) {
        const children = refs.get("children")
        if ("id" in event && "value" in event) {
          children[event.id] = event.value
        }
        refs.set("children", children)
      },
      setHighlightedItem({context, event}) {
        context.set("itemFocusVisible", false)
        if ("value" in event && event.value) {
          context.set("highlightedValue", event.value as string)
        } else if ("target" in event) {
          context.set(
            "highlightedValue",
            getItemValue(event.target as HTMLElement),
          )
        } else {
          context.set("highlightedValue", null)
        }
      },
      setIntentPolygon({context, event, scope}) {
        const menu = domEls.content(scope)
        const placement = context.get("currentPlacement")

        if (!menu || !placement) {
          return
        }

        const rect = menu.getBoundingClientRect()
        const polygon = getElementPolygon(rect, placement)
        if (!polygon) {
          return
        }

        const rightSide = getPlacementSide(placement) === "right"
        const bleed = rightSide ? -5 : +5

        const point = "point" in event ? event.point : ({} as any)

        context.set("intentPolygon", [
          {...point, x: point.x + bleed},
          ...polygon,
        ])
      },
      setLastHighlightedItem({context, event}) {
        if ("target" in event) {
          context.set(
            "lastHighlightedValue",
            getItemValue(event.target as HTMLElement),
          )
        }
      },
      setOptionState({event}) {
        if (!("option" in event) || !event.option) {
          return
        }
        const {checked, onCheckedChange, type} = event.option
        if (type === "radio") {
          onCheckedChange?.(true)
        } else if (type === "checkbox") {
          onCheckedChange?.(!checked)
        }
      },
      setParentMenu({event, refs}) {
        refs.set(
          "parent",
          "value" in event ? (event.value as Machine<MenuSchema>) : null,
        )
      },
      setSubmenuPlacement({computed, refs}) {
        if (!computed("isSubmenu")) {
          return
        }
        const placement = computed("isRtl") ? "left-start" : "right-start"
        refs.set("positioningOverride", {gutter: 0, placement})
      },
      toggleVisibility({event, prop, send}) {
        send({
          previousEvent: event,
          type: prop("open") ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE",
        })
      },
    },
    computed: {
      highlightedId: ({context, refs, scope}) =>
        resolveItemId(
          refs.get("children"),
          context.get("highlightedValue"),
          scope,
        ),
      isRtl: ({prop}) => prop("dir") === "rtl",
      isSubmenu: ({refs}) => !!refs.get("parent"),
      isTypingAhead: ({refs}) => refs.get("typeaheadState").keysSoFar !== "",
    },
    context({bindable, prop}) {
      return {
        anchorPoint: bindable<Point | null>(() => ({
          defaultValue: null,
          hash(value) {
            return `x: ${value?.x}, y: ${value?.y}`
          },
        })),
        currentPlacement: bindable<Placement | undefined>(() => ({
          defaultValue: undefined,
        })),
        highlightedValue: bindable<string | null>(() => ({
          defaultValue: prop("defaultHighlightedValue") || null,
          onChange(value) {
            prop("onHighlightChange")?.(value)
          },
          value: prop("highlightedValue"),
        })),
        intentPolygon: bindable<Point[] | null>(() => ({
          defaultValue: null,
        })),
        itemFocusVisible: bindable<boolean>(() => ({
          defaultValue: false,
        })),
        lastHighlightedValue: bindable<string | null>(() => ({
          defaultValue: null,
        })),
        suspendPointer: bindable<boolean>(() => ({
          defaultValue: false,
        })),
      }
    },
    effects: {
      scrollToHighlightedItem({computed, event, scope}) {
        const exec = () => {
          if (event.type.startsWith("ITEM_POINTER")) {
            return
          }

          const itemEl = scope.getById(computed("highlightedId")!)
          const contentEl = domEls.content(scope)

          scrollIntoView(itemEl, {block: "nearest", rootEl: contentEl})
        }
        raf(() => exec())

        const contentEl = () => domEls.content(scope)
        return observeAttributes(contentEl, {
          attributes: ["aria-activedescendant"],
          callback: exec,
          defer: true,
        })
      },
      trackInteractOutside({computed, prop, refs, scope, send}) {
        const getContentEl = () => domEls.content(scope)
        let restoreFocus = true
        return trackDismissableElement(getContentEl, {
          defer: true,
          exclude: () => domEls.trigger(scope),
          onDismiss() {
            send({restoreFocus, src: "interact-outside", type: "CLOSE"})
          },
          onEscapeKeyDown(event) {
            prop("onEscapeKeyDown")?.(event)
            if (computed("isSubmenu")) {
              event.preventDefault()
            }
            closeRootMenu({parent: refs.get("parent")})
          },
          onFocusOutside(event) {
            const target = getEventTarget(event.detail.originalEvent)
            if (contains(domEls.content(scope), event.currentTarget)) {
              // fix for angular nested portal behavior
              event.preventDefault()
              domEls.content(scope)?.focus()
            }
            prop("onFocusOutside")?.(event)

            const isWithinContextTrigger = contains(
              domEls.contextTrigger(scope),
              target,
            )
            if (isWithinContextTrigger) {
              event.preventDefault()
              return
            }
          },
          onInteractOutside: prop("onInteractOutside"),
          onPointerDownOutside(event) {
            prop("onPointerDownOutside")?.(event)

            const target = getEventTarget(event.detail.originalEvent)
            const isWithinContextTrigger = contains(
              domEls.contextTrigger(scope),
              target,
            )
            if (isWithinContextTrigger && event.detail.contextmenu) {
              event.preventDefault()
              return
            }
            restoreFocus = !event.detail.focusable
          },
          onRequestDismiss: prop("onRequestDismiss"),
        })
      },
      trackPointerMove({context, flush, refs, scope, send}) {
        const parent = refs.get("parent")

        // NOTE: we're mutating parent context here. sending events to parent
        // doesn't work
        flush(() => {
          parent!.context.set("suspendPointer", true)
        })

        const doc = scope.getDoc()

        return addDomEvent(doc, "pointermove", (e) => {
          const isMovingToSubmenu = isWithinPolygon(
            context.get("intentPolygon"),
            {
              x: e.clientX,
              y: e.clientY,
            },
          )

          if (!isMovingToSubmenu) {
            send({type: "POINTER_MOVED_AWAY_FROM_SUBMENU"})
            parent!.context.set("suspendPointer", false)
          }
        })
      },
      trackPositioning({context, prop, refs, scope}) {
        if (!!domEls.contextTrigger(scope)) {
          return
        }
        const positioning = {
          ...prop("positioning"),
          ...refs.get("positioningOverride"),
        }
        context.set("currentPlacement", positioning.placement)
        const getPositionerEl = () => domEls.positioner(scope)
        return getPlacement(domEls.trigger(scope), getPositionerEl, {
          ...positioning,
          defer: true,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },
      waitForCloseDelay({send}) {
        const timer = setTimeout(() => {
          send({type: "DELAY.CLOSE"})
        }, 300)
        return () => clearTimeout(timer)
      },
      waitForLongPress({send}) {
        const timer = setTimeout(() => {
          send({type: "LONG_PRESS.OPEN"})
        }, 700)
        return () => clearTimeout(timer)
      },
      waitForOpenDelay({send}) {
        const timer = setTimeout(() => {
          send({type: "DELAY.OPEN"})
        }, 100)
        return () => clearTimeout(timer)
      },
    },
    guards: {
      closeOnSelect: ({event, prop}) =>
        "closeOnSelect" in event
          ? (event?.closeOnSelect ?? prop("closeOnSelect"))
          : prop("closeOnSelect"),
      isArrowDownEvent: ({event}) =>
        "previousEvent" in event && event.previousEvent?.type === "ARROW_DOWN",
      isArrowLeftEvent: ({event}) =>
        "previousEvent" in event && event.previousEvent?.type === "ARROW_LEFT",
      isArrowUpEvent: ({event}) =>
        "previousEvent" in event && event.previousEvent?.type === "ARROW_UP",
      isHighlightedItemEditable: ({computed, scope}) =>
        isEditableElement(scope.getById(computed("highlightedId")!)),
      isOpenAutoFocusEvent: ({event}) =>
        "previousEvent" in event &&
        event.previousEvent?.type === "OPEN_AUTOFOCUS",
      // guard assertions (for controlled mode)
      isOpenControlled: ({prop}) => prop("open") !== undefined,
      isPointerSuspended: ({context}) => context.get("suspendPointer"),
      isSubmenu: ({computed}) => computed("isSubmenu"),
      // whether the trigger is also a menu item
      isTriggerItem: ({event}) =>
        "target" in event && isTriggerItem(event.target as HTMLElement),
      // whether the trigger item is the active item
      isTriggerItemHighlighted: ({computed, event, scope}) => {
        const target = (("target" in event ? event.target : undefined) ??
          scope.getById(computed("highlightedId")!)) as HTMLElement | null
        return !!target?.hasAttribute("aria-controls")
      },
    },
    ids({bindableId}) {
      return {
        arrow: bindableId(),
        content: bindableId(),
        contextTrigger: bindableId(),
        group: bindableId(),
        positioner: bindableId(),
        root: bindableId(),
        trigger: bindableId(),
      }
    },
    initialState({prop}) {
      const open = prop("open") || prop("defaultOpen")
      return open ? "open" : "idle"
    },
    on: {
      "CHILD.SET": {
        actions: ["setChildMenu"],
      },
      CLOSE: [
        {
          actions: ["invokeOnClose"],
          guard: "isOpenControlled",
        },
        {
          actions: ["invokeOnClose"],
          target: "closed",
        },
      ],
      "HIGHLIGHTED.RESTORE": {
        actions: ["restoreHighlightedItem"],
      },
      "HIGHLIGHTED.SET": {
        actions: ["setHighlightedItem"],
      },
      OPEN: [
        {
          actions: ["invokeOnOpen"],
          guard: "isOpenControlled",
        },
        {
          actions: ["invokeOnOpen"],
          target: "open",
        },
      ],
      OPEN_AUTOFOCUS: [
        {
          actions: ["invokeOnOpen"],
          guard: "isOpenControlled",
        },
        {
          actions: ["highlightFirstItem", "invokeOnOpen"],
          // internal: true,
          target: "open",
        },
      ],
      "PARENT.SET": {
        actions: ["setParentMenu"],
      },
    },
    props({props}) {
      return {
        closeOnSelect: true,
        composite: true,
        dir: "ltr",
        loopFocus: false,
        navigate(details) {
          clickIfLink(details.node)
        },
        typeahead: true,
        ...props,
        positioning: {
          gutter: 5,
          placement: "bottom-start",
          ...props.positioning,
        },
        ...props,
      }
    },
    refs() {
      return {
        children: {},
        parent: null,
        positioningOverride: {},
        typeaheadState: {...getByTypeahead.defaultOptions},
      }
    },
    states: {
      closed: {
        entry: ["clearHighlightedItem", "focusTrigger", "resumePointer"],
        on: {
          ARROW_DOWN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["highlightFirstItem", "invokeOnOpen"],
              target: "open",
            },
          ],
          ARROW_UP: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["highlightLastItem", "invokeOnOpen"],
              target: "open",
            },
          ],
          CONTEXT_MENU: [
            {
              actions: ["setAnchorPoint", "invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setAnchorPoint", "invokeOnOpen"],
              target: "open",
            },
          ],
          CONTEXT_MENU_START: {
            actions: ["setAnchorPoint"],
            target: "opening:contextmenu",
          },
          "CONTROLLED.OPEN": [
            {
              actions: ["highlightFirstItem"],
              guard: or("isOpenAutoFocusEvent", "isArrowDownEvent"),
              target: "open",
            },
            {
              actions: ["highlightLastItem"],
              guard: "isArrowUpEvent",
              target: "open",
            },
            {
              target: "open",
            },
          ],
          TRIGGER_BLUR: {target: "idle"},
          TRIGGER_CLICK: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
          TRIGGER_POINTERMOVE: {
            guard: "isTriggerItem",
            target: "opening",
          },
        },
        tags: ["closed"],
      },

      closing: {
        effects: [
          "trackPointerMove",
          "trackInteractOutside",
          "waitForCloseDelay",
        ],
        on: {
          "CONTROLLED.CLOSE": {
            actions: ["focusParentMenu", "restoreParentHighlightedItem"],
            target: "closed",
          },
          "CONTROLLED.OPEN": {
            target: "open",
          },
          "DELAY.CLOSE": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "focusParentMenu",
                "restoreParentHighlightedItem",
                "invokeOnClose",
              ],
              target: "closed",
            },
          ],
          // don't invoke on open here since the menu is still open (we're only
          // keeping it open)
          MENU_POINTERENTER: {
            actions: ["clearIntentPolygon"],
            target: "open",
          },
          POINTER_MOVED_AWAY_FROM_SUBMENU: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["focusParentMenu", "restoreParentHighlightedItem"],
              target: "closed",
            },
          ],
        },
        tags: ["open"],
      },

      idle: {
        on: {
          CONTEXT_MENU: [
            {
              actions: ["setAnchorPoint", "invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setAnchorPoint", "invokeOnOpen"],
              target: "open",
            },
          ],
          CONTEXT_MENU_START: {
            actions: ["setAnchorPoint"],
            target: "opening:contextmenu",
          },
          "CONTROLLED.CLOSE": {
            target: "closed",
          },
          "CONTROLLED.OPEN": {
            target: "open",
          },
          TRIGGER_CLICK: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
          TRIGGER_FOCUS: {
            guard: not("isSubmenu"),
            target: "closed",
          },
          TRIGGER_POINTERMOVE: {
            guard: "isSubmenu",
            target: "opening",
          },
        },
        tags: ["closed"],
      },

      open: {
        effects: [
          "trackInteractOutside",
          "trackPositioning",
          "scrollToHighlightedItem",
        ],
        entry: ["focusMenu", "resumePointer"],
        on: {
          ARROW_DOWN: {
            actions: ["highlightNextItem", "focusMenu"],
          },
          ARROW_LEFT: [
            {
              actions: ["invokeOnClose"],
              guard: and("isSubmenu", "isOpenControlled"),
            },
            {
              actions: ["focusParentMenu", "invokeOnClose"],
              guard: "isSubmenu",
              target: "closed",
            },
          ],
          ARROW_RIGHT: {
            actions: ["openSubmenu"],
            guard: "isTriggerItemHighlighted",
          },
          ARROW_UP: {
            actions: ["highlightPrevItem", "focusMenu"],
          },
          CONTEXT_MENU: {
            actions: ["setAnchorPoint", "focusMenu"],
          },
          "CONTROLLED.CLOSE": [
            {
              actions: ["focusParentMenu"],
              guard: "isArrowLeftEvent",
              target: "closed",
            },
            {
              target: "closed",
            },
          ],
          END: {
            actions: ["highlightLastItem", "focusMenu"],
          },
          ENTER: [
            {
              actions: ["openSubmenu"],
              guard: "isTriggerItemHighlighted",
            },
            {
              actions: ["clickHighlightedItem"],
            },
          ],
          FOCUS_MENU: {
            actions: ["focusMenu"],
          },
          HOME: {
            actions: ["highlightFirstItem", "focusMenu"],
          },
          ITEM_CLICK: [
            // == grouped ==
            {
              actions: [
                "invokeOnSelect",
                "setOptionState",
                "closeRootMenu",
                "invokeOnClose",
              ],
              guard: and(
                not("isTriggerItemHighlighted"),
                not("isHighlightedItemEditable"),
                "closeOnSelect",
                "isOpenControlled" as keyof GuardFn<MenuSchema>,
              ),
            },
            {
              actions: [
                "invokeOnSelect",
                "setOptionState",
                "closeRootMenu",
                "invokeOnClose",
              ],
              guard: and(
                not("isTriggerItemHighlighted"),
                not("isHighlightedItemEditable"),
                "closeOnSelect",
              ),
              target: "closed",
            },
            //
            {
              actions: ["invokeOnSelect", "setOptionState"],
              guard: and(
                not("isTriggerItemHighlighted"),
                not("isHighlightedItemEditable"),
              ),
            },
            {actions: ["setHighlightedItem"]},
          ],
          ITEM_POINTERDOWN: {
            actions: ["setHighlightedItem"],
          },
          ITEM_POINTERLEAVE: {
            actions: ["clearHighlightedItem"],
            guard: and(not("isPointerSuspended"), not("isTriggerItem")),
          },
          ITEM_POINTERMOVE: [
            {
              actions: ["setHighlightedItem", "focusMenu"],
              guard: not("isPointerSuspended"),
            },
            {
              actions: ["setLastHighlightedItem"],
            },
          ],
          "POSITIONING.SET": {
            actions: ["reposition"],
          },
          TRIGGER_CLICK: [
            {
              actions: ["invokeOnClose"],
              guard: and(not("isTriggerItem"), "isOpenControlled"),
            },
            {
              actions: ["invokeOnClose"],
              guard: not("isTriggerItem"),
              target: "closed",
            },
          ],
          TRIGGER_POINTERLEAVE: {
            target: "closing",
          },
          TRIGGER_POINTERMOVE: {
            actions: ["setIntentPolygon"],
            guard: "isTriggerItem",
          },
          TYPEAHEAD: {
            actions: ["highlightMatchedItem"],
          },
        },
        tags: ["open"],
      },

      opening: {
        effects: ["waitForOpenDelay"],
        on: {
          BLUR: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "closed",
            },
          ],
          "CONTROLLED.CLOSE": {
            target: "closed",
          },
          "CONTROLLED.OPEN": {
            target: "open",
          },
          "DELAY.OPEN": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
          TRIGGER_POINTERLEAVE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "closed",
            },
          ],
        },
        tags: ["closed"],
      },

      "opening:contextmenu": {
        effects: ["waitForLongPress"],
        on: {
          CONTEXT_MENU_CANCEL: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "closed",
            },
          ],
          "CONTROLLED.CLOSE": {target: "closed"},
          "CONTROLLED.OPEN": {target: "open"},
          "LONG_PRESS.OPEN": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "open",
            },
          ],
        },
        tags: ["closed"],
      },
    },
    watch({action, computed, context, prop, track}) {
      track([() => computed("isSubmenu")], () => {
        action(["setSubmenuPlacement"])
      })
      track([() => context.hash("anchorPoint")], () => {
        action(["reposition"])
      })
      track([() => prop("open")], () => {
        action(["toggleVisibility"])
      })
    },
  },
)

function closeRootMenu(ctx: {parent: Machine<MenuSchema> | null}) {
  let parent = ctx.parent
  while (parent && parent.computed("isSubmenu")) {
    parent = parent.refs.get("parent")
  }
  parent?.send({type: "CLOSE"})
}

function isWithinPolygon(polygon: Point[] | null, point: Point) {
  if (!polygon) {
    return false
  }
  return isPointInPolygon(polygon, point)
}

function resolveItemId(
  children: Record<string, Machine<MenuSchema>>,
  value: string | null,
  scope: MenuScope,
) {
  const hasChildren = Object.keys(children).length > 0
  if (!value) {
    return null
  }
  if (!hasChildren) {
    return getItemId(scope, value)
  }
  for (const id in children) {
    const childMenu = children[id]
    const childTriggerId = domIds.trigger(childMenu.scope)
    if (childTriggerId === value) {
      return childTriggerId
    }
  }
  return getItemId(scope, value)
}
