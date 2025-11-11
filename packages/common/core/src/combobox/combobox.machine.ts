import {ariaHidden} from "@qualcomm-ui/dom/aria-hidden"
import {trackDismissableElement} from "@qualcomm-ui/dom/dismissable"
import {getPlacement, type Placement} from "@qualcomm-ui/dom/floating-ui"
import {trackFocusVisible} from "@qualcomm-ui/dom/focus-visible"
import {
  nextTick,
  observeAttributes,
  raf,
  scrollIntoView,
  setCaretToEnd,
} from "@qualcomm-ui/dom/query"
import {addOrRemove, remove} from "@qualcomm-ui/utils/array"
import {isEqual} from "@qualcomm-ui/utils/equal"
import {match} from "@qualcomm-ui/utils/functions"
import {isBoolean} from "@qualcomm-ui/utils/guard"
import {
  createChoose,
  createGuards,
  createMachine,
  type GuardFn,
  type MachineConfig,
} from "@qualcomm-ui/utils/machine"

import {emptyCollection} from "./combobox.collection"
import type {ComboboxOpenChangeReason, ComboboxSchema} from "./combobox.types"
import {domEls, focusInputEl, focusTriggerEl, getItemEl} from "./internal"

const {and, not} = createGuards<ComboboxSchema>()

export const comboboxMachine: MachineConfig<ComboboxSchema> =
  createMachine<ComboboxSchema>({
    actions: {
      autofillInputValue({computed, context, event, prop, scope}) {
        const inputEl = domEls.input(scope)
        const collection = prop("collection")
        if (!computed("autoComplete") || !inputEl || !event.keypress) {
          return
        }
        const valueText = collection.stringify(context.get("highlightedValue"))
        raf(() => {
          inputEl.value = valueText || context.get("inputValue")
        })
      },
      clearHighlightedValue({context}) {
        context.set("highlightedValue", null)
      },
      clearInputValue({context}) {
        context.set("inputValue", "")
      },
      clearItem(params) {
        const {context, event, flush, prop} = params
        if (event.value == null) {
          return
        }
        flush(() => {
          const nextValue = remove(context.get("value"), event.value)
          context.set("value", nextValue)

          // set input value
          const inputValue = match(prop("selectionBehavior"), {
            clear: "",
            preserve: context.get("inputValue"),
            replace: prop("collection").stringifyMany(nextValue),
          })
          context.set("inputValue", inputValue)
        })
      },
      clearSelectedItems(params) {
        const {context, flush, prop} = params
        flush(() => {
          context.set("value", [])

          // set input value
          const inputValue = match(prop("selectionBehavior"), {
            clear: "",
            preserve: context.get("inputValue"),
            replace: prop("collection").stringifyMany([]),
          })
          context.set("inputValue", inputValue)
        })
      },
      highlightFirstItem({context, prop, scope}) {
        const exec = domEls.content(scope) ? queueMicrotask : raf
        exec(() => {
          const value = prop("collection").firstValue
          if (value) {
            context.set("highlightedValue", value)
          }
        })
      },
      highlightFirstItemIfNeeded({action, computed}) {
        if (!computed("autoHighlight")) {
          return
        }
        action(["highlightFirstItem"])
      },
      highlightFirstOrSelectedItem({computed, context, prop}) {
        raf(() => {
          let value: string | null = null
          if (computed("hasSelectedItems")) {
            value = prop("collection").sort(context.get("value"))[0]
          } else {
            value = prop("collection").firstValue
          }
          if (value) {
            context.set("highlightedValue", value)
          }
        })
      },
      highlightFirstSelectedItem({context, prop}) {
        raf(() => {
          const [value] = prop("collection").sort(context.get("value"))
          if (value) {
            context.set("highlightedValue", value)
          }
        })
      },
      highlightLastItem({context, prop, scope}) {
        const exec = domEls.content(scope) ? queueMicrotask : raf
        exec(() => {
          const value = prop("collection").lastValue
          if (value) {
            context.set("highlightedValue", value)
          }
        })
      },
      highlightLastOrSelectedItem({computed, context, prop}) {
        raf(() => {
          const collection = prop("collection")
          let value: string | null = null
          if (computed("hasSelectedItems")) {
            value = collection.sort(context.get("value"))[0]
          } else {
            value = collection.lastValue
          }
          if (value) {
            context.set("highlightedValue", value)
          }
        })
      },
      highlightNextItem({context, prop}) {
        let value: string | null = null
        const highlightedValue = context.get("highlightedValue")
        const collection = prop("collection")
        if (highlightedValue) {
          value = collection.getNextValue(highlightedValue)
          if (!value && prop("loopFocus")) {
            value = collection.firstValue
          }
        } else {
          value = collection.firstValue
        }
        if (value) {
          context.set("highlightedValue", value)
        }
      },
      highlightPrevItem({context, prop}) {
        let value: string | null = null
        const highlightedValue = context.get("highlightedValue")
        const collection = prop("collection")
        if (highlightedValue) {
          value = collection.getPreviousValue(highlightedValue)
          if (!value && prop("loopFocus")) {
            value = collection.lastValue
          }
        } else {
          value = collection.lastValue
        }
        if (value) {
          context.set("highlightedValue", value)
        }
      },
      invokeOnClose({event, prop}) {
        const reason = getOpenChangeReason(event)
        prop("onOpenChange")?.({open: false, reason})
      },
      invokeOnOpen({event, prop}) {
        const reason = getOpenChangeReason(event)
        prop("onOpenChange")?.({open: true, reason})
      },
      reposition({context, event, prop, scope}) {
        const controlEl = () => domEls.control(scope)
        const positionerEl = () => domEls.positioner(scope)
        getPlacement(controlEl, positionerEl, {
          ...prop("positioning"),
          ...event.options,
          defer: true,
          listeners: false,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },
      revertInputValue({computed, context, prop}) {
        const selectionBehavior = prop("selectionBehavior")
        // Without this, all items briefly render as the text input filter is
        // removed. This creates a noticeable jump as the content expands briefly
        // before it closes.
        raf(() => {
          const inputValue = match(selectionBehavior, {
            clear: "",
            preserve: context.get("inputValue"),
            replace: computed("hasSelectedItems")
              ? computed("valueAsString")
              : "",
          })
          context.set("inputValue", inputValue)
        })
      },
      scrollContentToTop({prop, refs, scope}) {
        const scrollToIndexFn = refs.get("scrollToIndexFn")
        if (scrollToIndexFn) {
          const firstValue = prop("collection").firstValue
          scrollToIndexFn({
            getElement: () => getItemEl(scope, firstValue),
            immediate: true,
            index: 0,
          })
        } else {
          const contentEl = domEls.content(scope)
          if (!contentEl) {
            return
          }
          contentEl.scrollTop = 0
        }
      },
      scrollToHighlightedItem({context, prop, refs, scope}) {
        nextTick(() => {
          const highlightedValue = context.get("highlightedValue")
          if (highlightedValue == null) {
            return
          }

          const itemEl = getItemEl(scope, highlightedValue)
          const contentEl = domEls.content(scope)

          const scrollToIndexFn = refs.get("scrollToIndexFn")
          if (scrollToIndexFn) {
            const highlightedIndex =
              prop("collection").indexOf(highlightedValue)
            scrollToIndexFn({
              getElement: () => getItemEl(scope, highlightedValue),
              immediate: true,
              index: highlightedIndex,
            })
            return
          }

          scrollIntoView(itemEl, {block: "nearest", rootEl: contentEl})
        })
      },
      selectHighlightedItem(params) {
        const {context, prop} = params
        const collection = prop("collection")

        // check if item is valid
        const highlightedValue = context.get("highlightedValue")
        if (!highlightedValue || !collection.has(highlightedValue)) {
          return
        }

        // select item
        const nextValue = prop("multiple")
          ? addOrRemove(context.get("value"), highlightedValue)
          : [highlightedValue]
        prop("onSelect")?.({itemValue: highlightedValue, value: nextValue})
        context.set("value", nextValue)

        // set input value
        const inputValue = match(prop("selectionBehavior"), {
          clear: "",
          preserve: context.get("inputValue"),
          replace: collection.stringifyMany(nextValue),
        })
        context.set("inputValue", inputValue)
      },
      selectItem(params) {
        const {context, event, flush, prop} = params
        if (event.value == null) {
          return
        }
        flush(() => {
          const nextValue = prop("multiple")
            ? addOrRemove(context.get("value"), event.value)
            : [event.value]
          prop("onSelect")?.({itemValue: event.value, value: nextValue})
          context.set("value", nextValue)

          // set input value
          const inputValue = match(prop("selectionBehavior"), {
            clear: "",
            preserve: context.get("inputValue"),
            replace: prop("collection").stringifyMany(nextValue),
          })
          context.set("inputValue", inputValue)
        })
      },
      setFinalFocus({scope}) {
        raf(() => {
          const triggerEl = domEls.trigger(scope)
          if (triggerEl?.dataset.focusable == null) {
            focusInputEl(scope)
          } else {
            focusTriggerEl(scope)
          }
        })
      },
      setHighlightedValue({context, event}) {
        if (event.value == null) {
          return
        }
        context.set("highlightedValue", event.value)
      },
      setInitialFocus({scope}) {
        raf(() => {
          focusInputEl(scope)
        })
      },
      setInputValue({context, event}) {
        context.set("inputValue", event.value)
      },
      setValue(params) {
        const {context, event, flush, prop} = params
        flush(() => {
          context.set("value", event.value)

          // set input value
          const inputValue = match(prop("selectionBehavior"), {
            clear: "",
            preserve: context.get("inputValue"),
            replace: prop("collection").stringifyMany(event.value),
          })
          context.set("inputValue", inputValue)
        })
      },
      syncHighlightedItem({context, prop}) {
        const item = prop("collection").find(context.get("highlightedValue"))
        context.set("highlightedItem", item, {})
      },
      syncInputFocus({scope, state}) {
        const input = domEls.input(scope)
        if (!input) {
          return
        }
        if (
          input.ownerDocument.activeElement === input &&
          state.get() !== "focused"
        ) {
          state.set("focused")
        }
      },
      syncInputValue({context, event, scope}) {
        const inputEl = domEls.input(scope)

        if (!inputEl) {
          return
        }
        inputEl.value = context.get("inputValue")

        queueMicrotask(() => {
          if (event.current().type === "INPUT.CHANGE") {
            return
          }
          setCaretToEnd(inputEl)
        })
      },
      syncSelectedItems(params) {
        queueMicrotask(() => {
          const {context, prop} = params
          const collection = prop("collection")
          const value = context.get("value")

          // set selected items (based on value)
          const selectedItems = value.map((v) => {
            const item = context
              .get("selectedItems")
              .find((item) => collection.getItemValue(item) === v)
            return item || collection.find(v)
          })
          context.set("selectedItems", selectedItems)

          // set input value
          const inputValue = match(prop("selectionBehavior"), {
            clear: "",
            preserve: context.get("inputValue"),
            replace: collection.stringifyMany(value),
          })
          context.set("inputValue", inputValue)
        })
      },
      toggleVisibility({event, prop, send}) {
        send({
          previousEvent: event,
          type: prop("open") ? "CONTROLLED.OPEN" : "CONTROLLED.CLOSE",
        })
      },
    },

    computed: {
      autoComplete: ({prop}) => prop("inputBehavior") === "autocomplete",
      autoHighlight: ({prop}) => prop("inputBehavior") === "autohighlight",
      hasSelectedItems: ({context}) => context.get("value").length > 0,
      isCustomValue: ({computed, context}) =>
        context.get("inputValue") !== computed("valueAsString"),
      isInputValueEmpty: ({context}) => context.get("inputValue").length === 0,
      isInteractive: ({prop}) => !(prop("readOnly") || prop("disabled")),
      valueAsString: ({context, prop}) =>
        prop("collection").stringifyItems(context.get("selectedItems")),
    },

    context({bindable, getContext, getEvent, prop}) {
      return {
        currentPlacement: bindable<Placement | undefined>(() => ({
          defaultValue: undefined,
        })),
        highlightedItem: bindable<string | null>(() => {
          const highlightedValue = prop("highlightedValue")
          const highlightedItem = prop("collection").find(highlightedValue)
          return {defaultValue: highlightedItem}
        }),
        highlightedValue: bindable<string | null>(() => ({
          defaultValue: prop("defaultHighlightedValue") || null,
          onChange(value) {
            const item = prop("collection").find(value)
            prop("onHighlightChange")?.({
              highlightedItem: item,
              highlightedValue: value,
            })
          },
          value: prop("highlightedValue"),
        })),
        inputValue: bindable<string>(() => {
          let inputValue = prop("inputValue") || prop("defaultInputValue") || ""
          const value = prop("value") || prop("defaultValue") || []

          if (!inputValue.trim() && !prop("multiple")) {
            const valueAsString = prop("collection").stringifyMany(value)
            inputValue = match(prop("selectionBehavior"), {
              clear: "",
              preserve: inputValue || valueAsString,
              replace: valueAsString,
            })
          }

          return {
            defaultValue: inputValue,
            onChange(value) {
              const event = getEvent()
              const reason = (event.previousEvent || event).src
              prop("onInputValueChange")?.({inputValue: value, reason})
            },
            value: prop("inputValue"),
          }
        }),
        selectedItems: bindable<string[]>(() => {
          const value = prop("value") || prop("defaultValue") || []
          const selectedItems = prop("collection").findMany(value)
          return {defaultValue: selectedItems}
        }),
        value: bindable(() => ({
          defaultValue: prop("defaultValue"),
          hash(value) {
            return value.join(",")
          },
          isEqual,
          onChange(value) {
            const context = getContext()
            const prevSelectedItems = context.get("selectedItems")
            const collection = prop("collection")

            const nextItems: any[] = value.map((v: string) => {
              const item = prevSelectedItems.find(
                (item: any) => collection.getItemValue(item) === v,
              )
              return item || collection.find(v)
            })

            context.set("selectedItems", nextItems)

            prop("onValueChange")?.({items: nextItems, value})
          },
          value: prop("value"),
        })),
      }
    },

    effects: {
      hideOtherElements({scope}) {
        return ariaHidden([
          domEls.input(scope),
          domEls.content(scope),
          domEls.trigger(scope),
          domEls.clearTrigger(scope),
        ])
      },
      scrollToHighlightedItem({context, event, prop, refs, scope}) {
        const inputEl = domEls.input(scope)

        const cleanups: VoidFunction[] = []

        const exec = (immediate: boolean) => {
          const pointer = event.current().type.includes("POINTER")
          const highlightedValue = context.get("highlightedValue")
          if (pointer || !highlightedValue) {
            return
          }

          const contentEl = domEls.content(scope)

          const scrollToIndexFn = refs.get("scrollToIndexFn")
          if (scrollToIndexFn) {
            const highlightedIndex =
              prop("collection").indexOf(highlightedValue)
            scrollToIndexFn({
              getElement: () => getItemEl(scope, highlightedValue),
              immediate,
              index: highlightedIndex,
            })
            return
          }

          const itemEl = getItemEl(scope, highlightedValue)
          const raf_cleanup = raf(() => {
            scrollIntoView(itemEl, {block: "nearest", rootEl: contentEl})
          })
          cleanups.push(raf_cleanup)
        }

        const rafCleanup = raf(() => exec(true))
        cleanups.push(rafCleanup)

        const observerCleanup = observeAttributes(inputEl, {
          attributes: ["aria-activedescendant"],
          callback: () => exec(false),
        })
        cleanups.push(observerCleanup)

        return () => {
          cleanups.forEach((cleanup) => cleanup())
        }
      },
      trackDismissableLayer({prop, scope, send}) {
        if (prop("disableLayer")) {
          return
        }
        const contentEl = () => domEls.content(scope)
        return trackDismissableElement(contentEl, {
          defer: true,
          exclude: () => [
            domEls.input(scope),
            domEls.trigger(scope),
            domEls.clearTrigger(scope),
          ],
          onDismiss() {
            send({
              restoreFocus: false,
              src: "interact-outside",
              type: "LAYER.INTERACT_OUTSIDE",
            })
          },
          onEscapeKeyDown(event) {
            event.preventDefault()
            event.stopPropagation()
            send({src: "escape-key", type: "LAYER.ESCAPE"})
          },
          onFocusOutside: prop("onFocusOutside"),
          onInteractOutside: prop("onInteractOutside"),
          onPointerDownOutside: prop("onPointerDownOutside"),
          type: "listbox",
        })
      },
      trackFocusVisible({scope}) {
        return trackFocusVisible({root: scope.getRootNode?.()})
      },
      trackPlacement({context, prop, scope}) {
        const anchorEl = () => domEls.control(scope) || domEls.trigger(scope)
        const positionerEl = () => domEls.positioner(scope)

        context.set("currentPlacement", prop("positioning").placement)
        return getPlacement(anchorEl, positionerEl, {
          ...prop("positioning"),
          defer: true,
          onComplete(data) {
            context.set("currentPlacement", data.placement)
          },
        })
      },
    },

    guards: {
      allowCustomValue: ({prop}) => !!prop("allowCustomValue"),
      autoComplete: ({computed, prop}) =>
        computed("autoComplete") && !prop("multiple"),
      autoFocus: ({prop}) => !!prop("autoFocus"),
      autoHighlight: ({computed}) => computed("autoHighlight"),
      closeOnSelect: ({prop}) => !!prop("closeOnSelect"),
      hasHighlightedItem: ({context}) =>
        context.get("highlightedValue") != null,
      isChangeEvent: ({event}) => event.previousEvent?.type === "INPUT.CHANGE",
      isCustomValue: ({computed}) => computed("isCustomValue"),
      isFirstItemHighlighted: ({context, prop}) =>
        prop("collection").firstValue === context.get("highlightedValue"),
      isHighlightedItemRemoved: ({context, prop}) =>
        !prop("collection").has(context.get("highlightedValue")),
      isInputValueEmpty: ({computed}) => computed("isInputValueEmpty"),
      isLastItemHighlighted: ({context, prop}) =>
        prop("collection").lastValue === context.get("highlightedValue"),
      isOpenControlled: ({prop}) => prop("open") != null,
      openOnChange: ({context, prop}) => {
        const openOnChange = prop("openOnChange")
        if (isBoolean(openOnChange)) {
          return openOnChange
        }
        return !!openOnChange?.({inputValue: context.get("inputValue")})
      },
      restoreFocus: ({event}) =>
        event.restoreFocus == null ? true : !!event.restoreFocus,
    },

    ids: ({bindableId, ids}) => {
      return {
        clearTrigger: bindableId(ids?.clearTrigger),
        content: bindableId(ids?.content),
        control: bindableId(ids?.control),
        errorText: bindableId(ids?.errorText),
        hint: bindableId(ids?.hint),
        input: bindableId(ids?.input),
        label: bindableId(ids?.label),
        positioner: bindableId(ids?.positioner),
        root: bindableId(ids?.root),
        trigger: bindableId(ids?.trigger),
      }
    },

    initialActions: [
      createChoose<ComboboxSchema>([
        {
          actions: ["setInitialFocus"],
          guard: "autoFocus",
        },
      ]) as any,
      "syncInputFocus",
    ],

    initialEffects: ["trackFocusVisible"],

    initialState({prop}) {
      const open = prop("open") || prop("defaultOpen")
      return open ? "suggesting" : "idle"
    },

    on: {
      "HIGHLIGHTED_VALUE.CLEAR": {
        actions: ["clearHighlightedValue"],
      },
      "HIGHLIGHTED_VALUE.SET": {
        actions: ["setHighlightedValue"],
      },
      "INPUT_VALUE.SET": {
        actions: ["setInputValue"],
      },
      "ITEM.CLEAR": {
        actions: ["clearItem"],
      },
      "ITEM.SELECT": {
        actions: ["selectItem"],
      },
      "POSITIONING.SET": {
        actions: ["reposition"],
      },
      "SELECTED_ITEMS.SYNC": {
        actions: ["syncSelectedItems"],
      },
      "VALUE.SET": {
        actions: ["setValue"],
      },
    },

    props({props}) {
      return {
        allowCustomValue: false,
        alwaysSubmitOnEnter: false,
        closeOnSelect: !props.multiple,
        collection: props.collection || emptyCollection(),
        composite: true,
        defaultInputValue: "",
        defaultValue: [],
        inputBehavior: "none",
        loopFocus: true,
        openOnChange: true,
        openOnClick: false,
        openOnKeyPress: true,
        selectionBehavior: props.multiple ? "clear" : "replace",
        ...props,
        positioning: {
          gutter: 2,
          placement: "bottom-start",
          sameWidth: true,
          ...props.positioning,
        },
        translations: {
          clearTriggerLabel: "Clear value",
          triggerLabel: "Toggle suggestions",
          ...props.translations,
        },
      }
    },

    refs: ({prop}) => {
      return {
        scrollToIndexFn: prop("scrollToIndexFn"),
      }
    },

    states: {
      focused: {
        entry: ["scrollContentToTop", "clearHighlightedValue"],
        on: {
          "CONTROLLED.OPEN": [
            {
              guard: "isChangeEvent",
              target: "suggesting",
            },
            {
              target: "interacting",
            },
          ],
          "INPUT.ARROW_DOWN": [
            // == group 1 ==
            {
              actions: ["invokeOnOpen"],
              guard: and("isOpenControlled", "autoComplete"),
            },
            {
              actions: ["invokeOnOpen"],
              guard: "autoComplete",
              target: "interacting",
            },
            // == group 2 ==
            {
              actions: ["highlightFirstOrSelectedItem", "invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["highlightFirstOrSelectedItem", "invokeOnOpen"],
              target: "interacting",
            },
          ],
          "INPUT.ARROW_UP": [
            // == group 1 ==
            {
              actions: ["invokeOnOpen"],
              guard: "autoComplete",
              target: "interacting",
            },
            {
              actions: ["invokeOnOpen"],
              guard: "autoComplete",
              target: "interacting",
            },
            // == group 2 ==
            {
              actions: ["highlightLastOrSelectedItem", "invokeOnOpen"],
              target: "interacting",
            },
            {
              actions: ["highlightLastOrSelectedItem", "invokeOnOpen"],
              target: "interacting",
            },
          ],
          "INPUT.BLUR": {
            target: "idle",
          },
          "INPUT.CHANGE": [
            {
              actions: [
                "setInputValue",
                "invokeOnOpen",
                "highlightFirstItemIfNeeded",
              ],
              guard: and("isOpenControlled", "openOnChange"),
            },
            {
              actions: [
                "setInputValue",
                "invokeOnOpen",
                "highlightFirstItemIfNeeded",
              ],
              guard: "openOnChange",
              target: "suggesting",
            },
            {
              actions: ["setInputValue"],
            },
          ],
          "INPUT.CLICK": [
            {
              actions: ["highlightFirstSelectedItem", "invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["highlightFirstSelectedItem", "invokeOnOpen"],
              target: "interacting",
            },
          ],
          "INPUT.ESCAPE": {
            actions: ["revertInputValue"],
            guard: and("isCustomValue", not("allowCustomValue")),
          },
          "LAYER.INTERACT_OUTSIDE": {
            target: "idle",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "interacting",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: [
                "setInitialFocus",
                "highlightFirstSelectedItem",
                "invokeOnOpen",
              ],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setInitialFocus",
                "highlightFirstSelectedItem",
                "invokeOnOpen",
              ],
              target: "interacting",
            },
          ],
          "VALUE.CLEAR": {
            actions: ["clearInputValue", "clearSelectedItems"],
          },
        },
        tags: ["focused", "closed"],
      },

      idle: {
        entry: ["scrollContentToTop", "clearHighlightedValue"],
        on: {
          "CONTROLLED.OPEN": {
            target: "interacting",
          },
          "INPUT.CLICK": [
            {
              actions: ["highlightFirstSelectedItem", "invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["highlightFirstSelectedItem", "invokeOnOpen"],
              target: "interacting",
            },
          ],
          "INPUT.FOCUS": {
            target: "focused",
          },
          OPEN: [
            {
              actions: ["invokeOnOpen"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnOpen"],
              target: "interacting",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: [
                "setInitialFocus",
                "highlightFirstSelectedItem",
                "invokeOnOpen",
              ],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "setInitialFocus",
                "highlightFirstSelectedItem",
                "invokeOnOpen",
              ],
              target: "interacting",
            },
          ],
          "VALUE.CLEAR": {
            actions: [
              "clearInputValue",
              "clearSelectedItems",
              "setInitialFocus",
            ],
            target: "focused",
          },
        },
        tags: ["idle", "closed"],
      },

      interacting: {
        effects: [
          "scrollToHighlightedItem",
          "trackDismissableLayer",
          "trackPlacement",
          "hideOtherElements",
        ],
        entry: ["setInitialFocus"],
        on: {
          CHILDREN_CHANGE: [
            {
              actions: ["clearHighlightedValue"],
              guard: "isHighlightedItemRemoved",
            },
            {
              actions: ["scrollToHighlightedItem"],
            },
          ],
          CLOSE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "setFinalFocus"],
              target: "focused",
            },
          ],
          "CONTROLLED.CLOSE": [
            {
              actions: ["setFinalFocus"],
              guard: "restoreFocus",
              target: "focused",
            },
            {
              target: "idle",
            },
          ],
          "INPUT.ARROW_DOWN": [
            {
              actions: ["clearHighlightedValue", "scrollContentToTop"],
              guard: and("autoComplete", "isLastItemHighlighted"),
            },
            {
              actions: ["highlightNextItem"],
            },
          ],
          "INPUT.ARROW_UP": [
            {
              actions: ["clearHighlightedValue"],
              guard: and("autoComplete", "isFirstItemHighlighted"),
            },
            {
              actions: ["highlightPrevItem"],
            },
          ],
          "INPUT.CHANGE": [
            {
              actions: ["setInputValue"],
              guard: "autoComplete",
              target: "suggesting",
            },
            {
              actions: ["clearHighlightedValue", "setInputValue"],
              target: "suggesting",
            },
          ],
          "INPUT.END": {
            actions: ["highlightLastItem"],
          },
          "INPUT.ENTER": [
            // == group 1 ==
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and(
                "isOpenControlled",
                // TODO: fix and type
                "isCustomValue" as keyof GuardFn<ComboboxSchema>,
                not("hasHighlightedItem"),
                not("allowCustomValue"),
              ),
            },
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and(
                "isCustomValue",
                not("hasHighlightedItem"),
                not("allowCustomValue"),
              ),
              target: "focused",
            },
            // == group 2 ==
            {
              actions: ["selectHighlightedItem", "invokeOnClose"],
              guard: and("isOpenControlled", "closeOnSelect"),
            },
            {
              actions: [
                "selectHighlightedItem",
                "invokeOnClose",
                "setFinalFocus",
              ],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectHighlightedItem"],
            },
          ],
          "INPUT.HOME": {
            actions: ["highlightFirstItem"],
          },
          "ITEM.CLICK": [
            {
              actions: ["selectItem", "invokeOnClose"],
              guard: and("isOpenControlled", "closeOnSelect"),
            },
            {
              actions: ["selectItem", "invokeOnClose", "setFinalFocus"],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectItem"],
            },
          ],
          "ITEM.POINTER_LEAVE": {
            actions: ["clearHighlightedValue"],
          },
          "ITEM.POINTER_MOVE": {
            actions: ["setHighlightedValue"],
          },
          "LAYER.ESCAPE": [
            {
              actions: ["syncInputValue", "invokeOnClose"],
              guard: and("isOpenControlled", "autoComplete"),
            },
            {
              actions: ["syncInputValue", "invokeOnClose"],
              guard: "autoComplete",
              target: "focused",
            },
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "setFinalFocus"],
              target: "focused",
            },
          ],
          "LAYER.INTERACT_OUTSIDE": [
            // == group 1 ==
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and(
                "isOpenControlled",
                "isCustomValue" as keyof GuardFn<ComboboxSchema>,
                not("allowCustomValue"),
              ),
            },
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and("isCustomValue", not("allowCustomValue")),
              target: "idle",
            },
            // == group 2 ==
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "idle",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "focused",
            },
          ],
          "VALUE.CLEAR": [
            {
              actions: [
                "clearInputValue",
                "clearSelectedItems",
                "invokeOnClose",
              ],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "clearInputValue",
                "clearSelectedItems",
                "invokeOnClose",
                "setFinalFocus",
              ],
              target: "focused",
            },
          ],
        },
        tags: ["open", "focused"],
      },

      suggesting: {
        effects: [
          "trackDismissableLayer",
          "scrollToHighlightedItem",
          "trackPlacement",
          "hideOtherElements",
        ],
        entry: ["setInitialFocus"],
        on: {
          CHILDREN_CHANGE: [
            {
              actions: ["highlightFirstItem"],
              guard: "autoHighlight",
            },
            {
              actions: ["clearHighlightedValue"],
              guard: "isHighlightedItemRemoved",
            },
          ],
          CLOSE: [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose", "setFinalFocus"],
              target: "focused",
            },
          ],
          "CONTROLLED.CLOSE": [
            {
              actions: ["setFinalFocus"],
              guard: "restoreFocus",
              target: "focused",
            },
            {
              target: "idle",
            },
          ],
          "INPUT.ARROW_DOWN": {
            actions: ["highlightNextItem"],
            target: "interacting",
          },
          "INPUT.ARROW_UP": {
            actions: ["highlightPrevItem"],
            target: "interacting",
          },
          "INPUT.CHANGE": {
            actions: ["setInputValue"],
          },
          "INPUT.END": {
            actions: ["highlightLastItem"],
            target: "interacting",
          },
          "INPUT.ENTER": [
            // == group 1 ==
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and(
                "isOpenControlled",
                "isCustomValue" as keyof GuardFn<ComboboxSchema>,
                not("hasHighlightedItem"),
                not("allowCustomValue"),
              ),
            },
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and(
                "isCustomValue",
                not("hasHighlightedItem"),
                not("allowCustomValue"),
              ),
              target: "focused",
            },
            // == group 2 ==
            {
              actions: ["selectHighlightedItem", "invokeOnClose"],
              guard: and("isOpenControlled", "closeOnSelect"),
            },
            {
              actions: [
                "selectHighlightedItem",
                "invokeOnClose",
                "setFinalFocus",
              ],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectHighlightedItem"],
            },
          ],
          "INPUT.HOME": {
            actions: ["highlightFirstItem"],
            target: "interacting",
          },
          "ITEM.CLICK": [
            {
              actions: ["selectItem", "invokeOnClose"],
              guard: and("isOpenControlled", "closeOnSelect"),
            },
            {
              actions: ["selectItem", "invokeOnClose", "setFinalFocus"],
              guard: "closeOnSelect",
              target: "focused",
            },
            {
              actions: ["selectItem"],
            },
          ],
          "ITEM.POINTER_LEAVE": {
            actions: ["clearHighlightedValue"],
          },
          "ITEM.POINTER_MOVE": {
            actions: ["setHighlightedValue"],
            target: "interacting",
          },
          "LAYER.ESCAPE": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "focused",
            },
          ],
          "LAYER.INTERACT_OUTSIDE": [
            // == group 1 ==
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and(
                "isOpenControlled",
                "isCustomValue" as keyof GuardFn<ComboboxSchema>,
                not("allowCustomValue"),
              ),
            },
            {
              actions: ["revertInputValue", "invokeOnClose"],
              guard: and("isCustomValue", not("allowCustomValue")),
              target: "idle",
            },
            // == group 2 ==
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "idle",
            },
          ],
          "TRIGGER.CLICK": [
            {
              actions: ["invokeOnClose"],
              guard: "isOpenControlled",
            },
            {
              actions: ["invokeOnClose"],
              target: "focused",
            },
          ],
          "VALUE.CLEAR": [
            {
              actions: [
                "clearInputValue",
                "clearSelectedItems",
                "invokeOnClose",
              ],
              guard: "isOpenControlled",
            },
            {
              actions: [
                "clearInputValue",
                "clearSelectedItems",
                "invokeOnClose",
                "setFinalFocus",
              ],
              target: "focused",
            },
          ],
        },
        tags: ["open", "focused"],
      },
    },

    watch({action, context, prop, send, track}) {
      track([() => context.hash("value")], () => {
        action(["syncSelectedItems"])
      })
      track([() => context.get("inputValue")], () => {
        action(["syncInputValue"])
      })
      track([() => context.get("highlightedValue")], () => {
        action(["syncHighlightedItem", "autofillInputValue"])
      })
      track([() => prop("open")], () => {
        action(["toggleVisibility"])
      })
      track([() => prop("collection").toString()], () => {
        send({type: "CHILDREN_CHANGE"})
      })
    },
  })

function getOpenChangeReason(
  event: ComboboxSchema["events"],
): ComboboxOpenChangeReason | undefined {
  return (event.previousEvent || event).src
}
