import {trackDismissableElement} from "@qualcomm-ui/dom/dismissable"
import {getPlacement, type Placement} from "@qualcomm-ui/dom/floating-ui"
import {trackFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  getByTypeahead,
  getInitialFocus,
  observeAttributes,
  raf,
  scrollIntoView,
  trackFormControl,
} from "@qualcomm-ui/dom/query"
import {addOrRemove} from "@qualcomm-ui/utils/array"
import type {CollectionItem, ListCollection} from "@qualcomm-ui/utils/collection"
import {isEqual} from "@qualcomm-ui/utils/equal"
import {isDefined} from "@qualcomm-ui/utils/guard"
import {
  createGuards,
  createMachine,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"
import {memo} from "@qualcomm-ui/utils/memo"

import {domEls} from "./internal"
import {emptyCollection} from "./select.collection"
import type {HiddenSelectOption, SelectSchema} from "./select.types"

const {and, not, or} = createGuards<SelectSchema>()

function isSingleValue(value: unknown): value is string | null {
  return typeof value === "string" || value === null
}

export const selectMachine: MachineConfig<SelectSchema> =
  createMachine<SelectSchema>({
    actions: {
      clearHighlightedItem({context}) {
        context.set("highlightedValue", null)
      },
      clearItem({context, event}) {
        if (!("value" in event)) {
          return
        }
        context.set("value", (prev) => prev.filter((v) => v !== event.value))
      },
      clearSelectedItems({context}) {
        context.set("value", [])
      },
      dispatchChangeEvent({scope}) {
        queueMicrotask(() => {
          const node = domEls.hiddenSelect(scope)
          if (!node) {
            return
          }
          const win = scope.getWin()
          const changeEvent = new (win as typeof window).Event("change", {
            bubbles: true,
            composed: true,
          })
          node.dispatchEvent(changeEvent)
        })
      },
      focusTriggerEl({scope}, event = {}) {
        if (!restoreFocusFn(event)) {
          return
        }
        raf(() => {
          const element = domEls.control(scope)
          element?.focus({preventScroll: true})
        })
      },
      highlightComputedFirstItem({computed, context, prop}) {
        const collection = prop("collection")
        const value = computed("hasSelectedItems")
          ? collection.sort(context.get("value"))[0]
          : collection.firstValue
        context.set("highlightedValue", value)
      },
      highlightComputedLastItem({computed, context, prop}) {
        const collection = prop("collection")
        const value = computed("hasSelectedItems")
          ? collection.sort(context.get("value"))[0]
          : collection.lastValue
        context.set("highlightedValue", value)
      },
      highlightFirstItem({context, prop}) {
        const value = prop("collection").firstValue
        context.set("highlightedValue", value)
      },
      highlightFirstSelectedItem({computed, context, prop}) {
        if (!computed("hasSelectedItems")) {
          return
        }
        const value = prop("collection").sort(context.get("value"))[0]
        context.set("highlightedValue", value)
      },
      highlightItem({context, event}) {
        if (!("value" in event) || !isSingleValue(event.value)) {
          return
        }
        context.set("highlightedValue", event.value)
      },
      highlightLastItem({context, prop}) {
        const value = prop("collection").lastValue
        context.set("highlightedValue", value)
      },
      highlightMatchingItem({context, event, prop, refs}) {
        if (!("key" in event)) {
          return
        }
        const value = prop("collection").search(event.key, {
          currentValue: context.get("highlightedValue"),
          state: refs.get("typeahead"),
        })

        if (value == null) {
          return
        }
        context.set("highlightedValue", value)
      },
      highlightNextItem({context, prop}) {
        const highlightedValue = context.get("highlightedValue")
        if (highlightedValue == null) {
          // the highlighted value will be null if the user clicks the trigger
          // instead of activating it with the keyboard. The next item in this
          // case is the first item.
          context.set("highlightedValue", prop("collection").firstValue)
          return
        }
        const value = prop("collection").getNextValue(
          highlightedValue,
          1,
          prop("loopFocus"),
        )
        context.set("highlightedValue", value)
      },
      highlightPreviousItem({context, prop}) {
        const highlightedValue = context.get("highlightedValue")
        if (highlightedValue == null) {
          // the highlighted value will be null if the user clicks the trigger
          // instead of activating it with the keyboard. The prev item in this
          // case is the last item.
          context.set("highlightedValue", prop("collection").lastValue)
          return
        }
        const value = prop("collection").getPreviousValue(
          highlightedValue,
          1,
          prop("loopFocus"),
        )
        context.set("highlightedValue", value)
      },
      invokeOnClose: ({prop}) => {
        prop("onOpenChange")?.(false)
      },

      invokeOnOpen: ({prop}) => {
        prop("onOpenChange")?.(true)
      },

      reposition({context, event, prop, scope}) {
        if (!("options" in event)) {
          return
        }
        getPlacement(
          () => domEls.control(scope),
          () => domEls.positioner(scope),
          {
            ...prop("positioning"),
            ...event.options,
            defer: true,
            listeners: false,
            onComplete(data) {
              context.set("currentPlacement", data.placement)
            },
          },
        )
      },

      scrollContentToTop({refs, scope}) {
        const scrollToIndexFn = refs.get("scrollToIndexFn")
        if (scrollToIndexFn) {
          scrollToIndexFn?.({immediate: true, index: 0})
        } else {
          domEls.content(scope)?.scrollTo(0, 0)
        }
      },

      selectFirstItem({context, prop}) {
        const value = prop("collection").firstValue
        if (value) {
          context.set("value", [value])
        }
      },

      selectHighlightedItem({context, event, prop}) {
        let value =
          "value" in event && isSingleValue(event.value) && event.value
            ? event.value
            : context.get("highlightedValue")
        if (value == null) {
          return
        }

        prop("onSelect")?.(value)

        const nullable =
          prop("deselectable") &&
          !prop("multiple") &&
          context.get("value").includes(value)
        value = nullable ? null : value
        context.set("value", (prev) => {
          if (value == null) {
            return []
          }
          if (prop("multiple")) {
            return addOrRemove(prev, value)
          }
          return [value]
        })
      },

      selectItem({context, event, prop}) {
        if (!("value" in event) || typeof event.value !== "string") {
          return
        }
        prop("onSelect")?.(event.value)

        const nullable =
          prop("deselectable") &&
          !prop("multiple") &&
          context.get("value").includes(event.value)
        const nextValue = nullable ? null : event.value
        context.set("value", (prev) => {
          if (nextValue == null) {
            return []
          }
          if (prop("multiple")) {
            return addOrRemove(prev, nextValue)
          }
          return [nextValue]
        })
      },

      selectLastItem({context, prop}) {
        const value = prop("collection").lastValue
        if (value) {
          context.set("value", [value])
        }
      },

      selectMatchingItem({context, event, prop, refs}) {
        if (!("key" in event)) {
          return
        }
        const value = prop("collection").search(event.key, {
          currentValue: context.get("value")[0],
          state: refs.get("typeahead"),
        })
        if (value == null) {
          return
        }
        context.set("value", [value])
      },

      selectPreviousItem({context, prop}) {
        const [firstItem] = context.get("value")
        const value = prop("collection").getPreviousValue(firstItem)
        if (value) {
          context.set("value", [value])
        }
      },

      setHighlightedItem({context, event}) {
        if ("value" in event && isSingleValue(event.value)) {
          context.set("highlightedValue", event.value)
        }
      },

      setInitialFocus({scope}) {
        raf(() => {
          const element = getInitialFocus({
            root: domEls.content(scope),
          })
          element?.focus({preventScroll: true})
        })
      },

      setSelectedItems({context, event}) {
        if ("value" in event && Array.isArray(event.value)) {
          context.set("value", event.value)
        }
      },

      syncCollection({context, prop}) {
        const collection = prop("collection")

        const highlightedItem = collection.find(context.get("highlightedValue"))
        if (highlightedItem) {
          context.set("highlightedItem", highlightedItem, null)
        }

        const selectedItems = collection.findMany(context.get("value"))
        context.set("selectedItems", selectedItems)

        const valueAsString = collection.stringifyItems(selectedItems)
        context.set("valueAsString", valueAsString)
      },

      syncHighlightedItem({context, prop}) {
        const collection = prop("collection")
        const highlightedValue = context.get("highlightedValue")
        const highlightedItem = highlightedValue
          ? collection.find(highlightedValue)
          : null
        context.set("highlightedItem", highlightedItem, null)
      },

      syncSelectedItems({context, prop}) {
        const collection = prop("collection")
        const prevSelectedItems = context.get("selectedItems")

        const value = context.get("value")
        const selectedItems = value.map((value) => {
          const item = prevSelectedItems.find(
            (item) => collection.getItemValue(item) === value,
          )
          return item || collection.find(value)
        })

        context.set("selectedItems", selectedItems)
        context.set("valueAsString", collection.stringifyItems(selectedItems))
      },

      syncSelectElement({context, prop, scope}) {
        const selectEl = domEls.hiddenSelect(scope)
        if (!selectEl) {
          return
        }

        if (context.get("value")?.length === 0 && !prop("multiple")) {
          selectEl.selectedIndex = -1
          return
        }

        for (const option of selectEl.options) {
          option.selected = context.get("value").includes(option.value)
        }
      },

      toggleVisibility: ({event, prop, send}) => {
        send({
          restoreFocus:
            "restoreFocus" in event ? event.restoreFocus : undefined,
          type: prop("open") ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE",
        })
      },
    },

    computed: {
      hasSelectedItems: ({context}) => (context.get("value")?.length ?? 0) > 0,
      hiddenSelectOptions: memo(
        ({prop}): [ListCollection] => [prop("collection")],
        (collection) => {
          return collection.items
            .map((item) => {
              return {
                disabled: collection.getItemDisabled(item),
                label: collection.stringifyItem(item),
                value: collection.getItemValue(item),
              }
            })
            .filter(
              (option): option is HiddenSelectOption =>
                option.label !== null && option.value !== null,
            )
        },
      ),
      isDisabled: ({context, prop}) =>
        prop("disabled") || context.get("fieldsetDisabled"),
      isEmpty: ({context}) => !context.get("value")?.length,
      isInteractive: ({prop}) => !(prop("disabled") || prop("readOnly")),
      isTypingAhead: ({refs}) => refs.get("typeahead").keysSoFar !== "",
    },

    context({bindable, prop}) {
      return {
        currentPlacement: bindable<Placement | undefined>(() => ({
          defaultValue: undefined,
        })),
        fieldsetDisabled: bindable<boolean>(() => ({
          defaultValue: false,
        })),
        highlightedItem: bindable<CollectionItem | null>(() => ({
          defaultValue: null,
        })),
        highlightedValue: bindable(() => ({
          defaultValue: prop("defaultHighlightedValue"),
          isEqual,
          onChange(highlightedValue) {
            prop("onHighlightChange")?.(highlightedValue, {
              highlightedIndex: prop("collection").indexOf(highlightedValue),
              highlightedItem: prop("collection").find(highlightedValue),
            })
          },
          value: prop("highlightedValue"),
        })),
        selectedItems: bindable<CollectionItem[]>(() => {
          const value = prop("value") ?? prop("defaultValue") ?? []
          const items = prop("collection").findMany(value)
          return {defaultValue: items, isEqual}
        }),
        value: bindable<string[]>(() => ({
          defaultValue: prop("defaultValue"),
          onChange(value) {
            const items = prop("collection").findMany(value ?? [])
            return prop("onValueChange")?.(value ?? [], {items})
          },
          value: prop("value"),
        })),
        valueAsString: bindable(() => {
          const value = prop("value") ?? prop("defaultValue") ?? []
          return {
            defaultValue: prop("collection").stringifyMany(value),
            isEqual,
          }
        }),
      }
    },

    effects: {
      computePlacement({context, prop, scope}) {
        const positioning = prop("positioning")
        context.set("currentPlacement", positioning.placement)
        const triggerEl = () => domEls.control(scope)
        const positionerEl = () => domEls.positioner(scope)
        return getPlacement(triggerEl, positionerEl, {
          defer: true,
          ...positioning,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },

      scrollToHighlightedItem({context, event, prop, refs, scope}) {
        const exec = (immediate: boolean) => {
          const highlightedValue = context.get("highlightedValue")
          if (highlightedValue == null) {
            return
          }

          // don't scroll into view if we're using the pointer
          if (event.current().type?.includes("POINTER")) {
            return
          }

          const optionEl = domEls.item(scope, highlightedValue)
          const contentEl = domEls.content(scope)

          const scrollToIndexFn = refs.get("scrollToIndexFn")
          if (scrollToIndexFn) {
            const highlightedIndex =
              prop("collection").indexOf(highlightedValue)
            scrollToIndexFn?.({immediate, index: highlightedIndex})
            return
          }

          scrollIntoView(optionEl, {block: "nearest", rootEl: contentEl})
        }

        raf(() => exec(true))

        const contentEl = () => domEls.content(scope)
        return observeAttributes(contentEl, {
          attributes: ["data-activedescendant"],
          callback() {
            exec(false)
          },
          defer: true,
        })
      },

      trackDismissableElement({prop, scope, send}) {
        const contentEl = () => domEls.content(scope)
        let restoreFocus = true
        return trackDismissableElement(contentEl, {
          defer: true,
          exclude: () => [domEls.control(scope), domEls.clearTrigger(scope)],
          onDismiss() {
            send({restoreFocus, src: "interact-outside", type: "CLOSE"})
          },
          onFocusOutside: prop("onFocusOutside"),
          onInteractOutside(event) {
            prop("onInteractOutside")?.(event)
            restoreFocus = !(event.detail.focusable || event.detail.contextmenu)
          },
          onPointerDownOutside: prop("onPointerDownOutside"),
          warnOnMissingNode: false,
        })
      },

      trackFocusVisible({scope}) {
        return trackFocusVisible({root: scope.getRootNode?.()})
      },

      trackFormControlState({context, scope}) {
        raf(() => {
          trackFormControl(domEls.hiddenSelect(scope), {
            onFieldsetDisabledChange(disabled) {
              context.set("fieldsetDisabled", disabled)
            },
            onFormReset() {
              const value = context.initial("value")
              context.set("value", value ?? [])
            },
          })
        })
      },
    },

    guards: {
      canHighlightNextItem: ({guard, prop}) => {
        return (
          !guard("hasHighlightedItem") ||
          prop("loopFocus") ||
          !guard("isLastItemHighlighted")
        )
      },
      canHighlightPreviousItem: ({guard, prop}) => {
        return (
          !guard("hasHighlightedItem") ||
          prop("loopFocus") ||
          !guard("isFirstItemHighlighted")
        )
      },
      closeOnSelect: ({prop}) => prop("closeOnSelect"),
      hasHighlightedItem: ({context}) => {
        return context.get("highlightedValue") != null
      },
      hasSelectedItems: ({computed}) => computed("hasSelectedItems"),
      isFirstItemHighlighted: ({context, prop}) =>
        context.get("highlightedValue") === prop("collection").firstValue,
      isLastItemHighlighted: ({context, prop}) =>
        context.get("highlightedValue") === prop("collection").lastValue,
      isOpenControlled: ({prop}) => isDefined(prop("open")),
      isTriggerArrowDownEvent: ({event}) =>
        event.previous().type === "TRIGGER.ARROW_DOWN",
      isTriggerArrowUpEvent: ({event}) =>
        event.previous().type === "TRIGGER.ARROW_UP",
      isTriggerClickEvent: ({event}) =>
        event.previous().type === "TRIGGER.CLICK",
      isTriggerEnterEvent: ({event}) =>
        event.previous().type === "TRIGGER.ENTER",
      loop: ({prop}) => prop("loopFocus"),
      multiple: ({prop}) => prop("multiple"),
      restoreFocus: ({event}) => restoreFocusFn(event),
    },

    ids: ({bindableId, ids}) => {
      return {
        clearTrigger: bindableId(ids?.clearTrigger),
        content: bindableId(ids?.content),
        control: bindableId(ids?.control),
        errorText: bindableId(ids?.errorText),
        hiddenSelect: bindableId(ids?.hiddenSelect),
        hint: bindableId(ids?.hint),
        item: bindableId<(id: string | number) => string>(),
        itemGroup: bindableId<(id: string | number) => string>(),
        itemGroupLabel: bindableId<(id: string | number) => string>(),
        label: bindableId(ids?.label),
        positioner: bindableId(ids?.positioner),
        root: bindableId(ids?.root),
      }
    },

    initialEffects: ["trackFormControlState", "trackFocusVisible"],

    initialState({prop}) {
      const open = prop("open") || prop("defaultOpen")
      return open ? "open" : "idle"
    },

    on: {
      "CLEAR.CLICK": {
        actions: ["clearSelectedItems", "focusTriggerEl"],
      },
      "HIGHLIGHTED_VALUE.SET": {
        actions: ["setHighlightedItem"],
      },
      "ITEM.CLEAR": {
        actions: ["clearItem"],
      },
      "ITEM.SELECT": {
        actions: ["selectItem"],
      },
      "VALUE.CLEAR": {
        actions: ["clearSelectedItems"],
      },
      "VALUE.SET": {
        actions: ["setSelectedItems"],
      },
    },

    props({props}) {
      return {
        closeOnSelect: !props.multiple,
        defaultValue: [],
        dir: "ltr",
        loopFocus: false,
        multiple: false,
        placeholder: "Select an option",
        ...props,
        collection: props.collection ?? emptyCollection(),
        positioning: {
          gutter: 2,
          placement: "bottom-start",
          sameWidth: true,
          ...props.positioning,
        },
      }
    },

    refs: ({prop}) => {
      return {
        scrollToIndexFn: prop("scrollToIndexFn"),
        typeahead: {...getByTypeahead.defaultOptions},
      }
    },

    states: {
      focused: {
        on: {
          "CONTROLLED.OPEN": [
            {
              actions: ["setInitialFocus", "highlightFirstSelectedItem"],
              guard: "isTriggerClickEvent",
              target: "open",
            },
            {
              actions: ["setInitialFocus", "highlightComputedLastItem"],
              guard: "isTriggerArrowUpEvent",
              target: "open",
            },
            {
              actions: ["setInitialFocus", "highlightComputedFirstItem"],
              guard: or("isTriggerArrowDownEvent", "isTriggerEnterEvent"),
              target: "open",
            },
            {
              actions: ["setInitialFocus"],
              target: "open",
            },
          ],
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitialFocus", "invokeOnOpen"],
              target: "open",
            },
          ],
          "TRIGGER.ARROW_DOWN": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setInitialFocus",
                "invokeOnOpen",
                "highlightComputedFirstItem",
              ],
              target: "open",
            },
          ],
          "TRIGGER.ARROW_LEFT": [
            {
              actions: ["selectPreviousItem"],
              guard: and(not("multiple"), "hasSelectedItems"),
            },
            {
              actions: ["selectLastItem"],
              guard: not("multiple"),
            },
          ],
          "TRIGGER.ARROW_UP": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setInitialFocus",
                "invokeOnOpen",
                "highlightComputedLastItem",
              ],
              target: "open",
            },
          ],
          "TRIGGER.BLUR": {
            target: "idle",
          },
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setInitialFocus",
                "invokeOnOpen",
                "highlightFirstSelectedItem",
              ],
              target: "open",
            },
          ],
          "TRIGGER.END": {
            actions: ["selectLastItem"],
            guard: not("multiple"),
          },
          "TRIGGER.ENTER": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setInitialFocus",
                "invokeOnOpen",
                "highlightComputedFirstItem",
              ],
              target: "open",
            },
          ],
          "TRIGGER.HOME": {
            actions: ["selectFirstItem"],
            guard: not("multiple"),
          },
          "TRIGGER.TYPEAHEAD": {
            actions: ["selectMatchingItem"],
            guard: not("multiple"),
          },
        },
        tags: ["closed"],
      },
      idle: {
        on: {
          "CONTROLLED.OPEN": [
            {
              actions: ["setInitialFocus", "highlightFirstSelectedItem"],
              guard: "isTriggerClickEvent",
              target: "open",
            },
            {
              actions: ["setInitialFocus"],
              target: "open",
            },
          ],
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["setInitialFocus", "invokeOnOpen"],
              target: "open",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "invokeOnOpen",
                "setInitialFocus",
                "highlightFirstSelectedItem",
              ],
              target: "open",
            },
          ],
          "TRIGGER.FOCUS": {
            target: "focused",
          },
        },
        tags: ["closed"],
      },
      open: {
        effects: [
          "trackDismissableElement",
          "computePlacement",
          "scrollToHighlightedItem",
        ],
        exit: ["scrollContentToTop"],
        on: {
          CLOSE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "invokeOnClose",
                "focusTriggerEl",
                "clearHighlightedItem",
              ],
              guard: "restoreFocus",
              target: "focused",
            },
            {
              actions: ["invokeOnClose", "clearHighlightedItem"],
              target: "idle",
            },
          ],
          "CONTENT.ARROW_DOWN": [
            {
              actions: ["highlightFirstItem"],
              guard: and("hasHighlightedItem", "loop", "isLastItemHighlighted"),
            },
            {
              actions: ["highlightNextItem"],
              guard: "canHighlightNextItem",
            },
          ],
          "CONTENT.ARROW_UP": [
            {
              actions: ["highlightLastItem"],
              guard: and(
                "hasHighlightedItem",
                "loop",
                "isFirstItemHighlighted",
              ),
            },
            {
              actions: ["highlightPreviousItem"],
              guard: "canHighlightPreviousItem",
            },
          ],
          "CONTENT.END": {
            actions: ["highlightLastItem"],
          },
          "CONTENT.HOME": {
            actions: ["highlightFirstItem"],
          },
          "CONTENT.TYPEAHEAD": {
            actions: ["highlightMatchingItem"],
          },
          "CONTROLLED.CLOSE": [
            {
              actions: ["focusTriggerEl", "clearHighlightedItem"],
              guard: "restoreFocus",
              target: "focused",
            },
            {
              actions: ["clearHighlightedItem"],
              target: "idle",
            },
          ],
          "ITEM.CLICK": [
            {
              actions: ["selectHighlightedItem", "invokeOnClose"],
              guard: and("closeOnSelect", "isOpenControlled"),
            },
            {
              actions: [
                "selectHighlightedItem",
                "invokeOnClose",
                "focusTriggerEl",
                "clearHighlightedItem",
              ],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectHighlightedItem"],
            },
          ],
          "ITEM.POINTER_LEAVE": {
            actions: ["clearHighlightedItem"],
          },
          "ITEM.POINTER_MOVE": {
            actions: ["highlightItem"],
          },
          "POSITIONING.SET": {
            actions: ["reposition"],
          },
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "clearHighlightedItem"],
              target: "focused",
            },
          ],
          "TRIGGER.TAB": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "invokeOnClose",
                "clearHighlightedItem",
                "focusTriggerEl",
              ],
              target: "focused",
            },
          ],
        },
        tags: ["open"],
      },
    },

    watch({action, context, prop, track}) {
      track([() => context.get("value")?.toString()], () => {
        action([
          "syncSelectedItems",
          "syncSelectElement",
          "dispatchChangeEvent",
        ])
      })
      track([() => prop("open")], () => {
        action(["toggleVisibility"])
      })
      track([() => context.get("highlightedValue")], () => {
        action(["syncHighlightedItem"])
      })
      track([() => prop("collection").toString()], () => {
        action(["syncCollection"])
      })
    },
  })

function restoreFocusFn(event: Record<string, any>) {
  const v = event.restoreFocus ?? event.previousEvent?.restoreFocus
  return v == null || !!v
}
