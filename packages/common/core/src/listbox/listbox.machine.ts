import {
  getInteractionModality,
  setInteractionModality,
  trackFocusVisible,
} from "@qualcomm-ui/dom/focus-visible"
import {
  getByTypeahead,
  observeAttributes,
  raf,
  scrollIntoView,
} from "@qualcomm-ui/dom/query"
import {
  type CollectionItem,
  createSelectedItemMap,
  deriveSelectionState,
  isGridCollection,
  ListSelection,
  resolveSelectedItems,
} from "@qualcomm-ui/utils/collection"
import {isEqual} from "@qualcomm-ui/utils/equal"
import {
  createGuards,
  createNarrowedMachine,
  type MachineConfig,
  type MachineConfigBase,
} from "@qualcomm-ui/utils/machine"

import {listboxCollection} from "./listbox.collection.js"
import {listboxDomEls} from "./listbox.dom.js"
import type {ListboxSchema, ListboxSelectionDetails} from "./listbox.types.js"

const {or} = createGuards<ListboxSchema>()

const listboxMachineBase = {
  computed: {
    hasSelectedItems: ({context}) => context.get("value").length > 0,
    isInteractive: ({prop}) => !prop("disabled"),
    isTypingAhead: ({refs}) => refs.get("typeahead").keysSoFar !== "",
    multiple: ({prop}) =>
      prop("selectionMode") === "multiple" ||
      prop("selectionMode") === "extended",
    selectedItems: ({context, prop}) =>
      resolveSelectedItems({
        collection: prop("collection"),
        selectedItemMap: context.get("selectedItemMap"),
        values: context.get("value"),
      }),
    selection: ({context, prop}) => {
      const selection = new ListSelection(context.get("value"))
      selection.selectionMode = prop("selectionMode")
      selection.deselectable = !!prop("deselectable")
      return selection
    },
    valueAsString: ({computed, prop}) =>
      prop("collection").stringifyItems(computed("selectedItems")),
  },

  context({bindable, getContext, prop}) {
    const initialValue = prop("value") ?? prop("defaultValue") ?? []
    const initialSelectedItems = prop("collection").findMany(initialValue)

    return {
      focused: bindable(() => ({
        defaultValue: false,
        sync: true,
      })),

      highlightedItem: bindable<CollectionItem | null>(() => ({
        defaultValue: null,
      })),

      highlightedValue: bindable<string | null>(() => ({
        defaultValue: prop("defaultHighlightedValue") || null,
        onChange(value) {
          prop("onHighlightChange")?.({
            highlightedIndex: prop("collection").indexOf(value),
            highlightedItem: prop("collection").find(value),
            highlightedValue: value,
          })
        },
        sync: true,
        value: prop("highlightedValue"),
      })),

      selectedItemMap: bindable<Map<string, CollectionItem>>(() => {
        return {
          defaultValue: createSelectedItemMap({
            collection: prop("collection"),
            selectedItems: initialSelectedItems,
          }),
        }
      }),

      value: bindable(() => ({
        defaultValue: prop("defaultValue"),
        isEqual,
        onChange(value) {
          const context = getContext()
          const collection = prop("collection")
          const selectedItemMap = context.get("selectedItemMap")

          const proposed = deriveSelectionState({
            collection,
            selectedItemMap,
            values: value,
          })

          // When controlled, use prop value so cache stays in sync when controller
          // ignores selection
          const effectiveValue = prop("value") ?? value
          const effective =
            effectiveValue === value
              ? proposed
              : deriveSelectionState({
                  collection,
                  selectedItemMap: proposed.nextSelectedItemMap,
                  values: effectiveValue,
                })

          context.set("selectedItemMap", effective.nextSelectedItemMap)
          return prop("onValueChange")?.({items: proposed.selectedItems, value})
        },
        value: prop("value"),
      })),
    }
  },

  effects: {
    scrollToHighlightedItem({context, prop, scope}) {
      const exec = (immediate: boolean) => {
        const highlightedValue = context.get("highlightedValue")
        if (highlightedValue == null) {
          return
        }

        const modality = getInteractionModality()

        // don't scroll into view if we're using the pointer
        if (modality === "pointer") {
          return
        }

        const contentEl = listboxDomEls.content(scope)

        const scrollToIndexFn = prop("scrollToIndexFn")
        if (scrollToIndexFn) {
          const highlightedIndex = prop("collection").indexOf(highlightedValue)
          scrollToIndexFn?.({
            getElement() {
              return listboxDomEls.item(scope, highlightedValue)
            },
            immediate,
            index: highlightedIndex,
          })
          return
        }

        const itemEl = listboxDomEls.item(scope, highlightedValue)
        scrollIntoView(itemEl, {block: "nearest", rootEl: contentEl})
      }

      raf(() => {
        setInteractionModality("virtual")
        exec(true)
      })

      const contentEl = () => listboxDomEls.content(scope)
      return observeAttributes(contentEl, {
        attributes: ["data-activedescendant"],
        callback() {
          exec(false)
        },
        defer: true,
      })
    },

    trackFocusVisible: ({refs, scope}) => {
      return trackFocusVisible({
        onChange(details) {
          refs.set("focusVisible", details.isFocusVisible)
        },
        root: scope.getRootNode?.(),
      })
    },
  },

  ids: ({bindableId, bindableIdCollection}) => {
    return {
      content: bindableId(),
      item: bindableIdCollection<string>(),
      itemGroup: bindableIdCollection<string>(),
      itemGroupLabel: bindableIdCollection<string>(),
      label: bindableId(),
      root: bindableId(),
    }
  },

  initialState() {
    return "idle"
  },
  on: {
    "HIGHLIGHT.FIRST": {
      actions: ["highlightFirstValue"],
    },
    "HIGHLIGHT.LAST": {
      actions: ["highlightLastValue"],
    },
    "HIGHLIGHT.NEXT": {
      actions: ["highlightNextValue"],
    },
    "HIGHLIGHT.PREV": {
      actions: ["highlightPreviousValue"],
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

  onInit: {
    effects: ["trackFocusVisible"],
  },

  props({props}) {
    return {
      collection: listboxCollection<CollectionItem>({items: []}),
      composite: true,
      defaultValue: [],
      dir: "ltr",
      loopFocus: false,
      multiple: false,
      orientation: "vertical",
      selectionMode: "single",
      typeahead: true,
      ...props,
    }
  },

  refs() {
    return {
      focusVisible: false,
      inputState: {autoHighlight: false, focused: false},
      typeahead: {...getByTypeahead.defaultOptions},
    }
  },

  states: {
    idle: {
      effects: ["scrollToHighlightedItem"],
      on: {
        "CONTENT.BLUR": {
          actions: ["clearFocused", "clearInputState"],
        },
        "CONTENT.FOCUS": [
          {
            actions: ["setFocused"],
            guard: or("hasSelectedValue", "hasHighlightedValue"),
          },
          {
            actions: ["setFocused", "setDefaultHighlightedValue"],
          },
        ],
        "CONTENT.TYPEAHEAD": {
          actions: ["setFocused", "highlightMatchingItem"],
        },
        "INPUT.FOCUS": {
          actions: ["setFocused", "setInputState"],
        },
        "ITEM.CLICK": {
          actions: ["setHighlightedItem", "selectHighlightedItem"],
        },
        NAVIGATE: {
          actions: ["setFocused", "setHighlightedItem", "selectWithKeyboard"],
        },
      },
    },
  },

  watch({action, context, prop, track}) {
    track([() => context.get("value").toString()], () => {
      action(["syncSelectedItems"])
    })
    track([() => context.get("highlightedValue")], () => {
      action(["syncHighlightedItem"])
    })
    track([() => prop("collection").toString()], () => {
      action(["syncHighlightedValue"])
    })
  },
} satisfies MachineConfigBase<ListboxSchema>

export const listboxMachine: MachineConfig<ListboxSchema> =
  createNarrowedMachine<ListboxSchema>()(listboxMachineBase, {
    actions: {
      clearFocused({context}) {
        context.set("focused", false)
      },

      clearHighlightedItem({context}) {
        context.set("highlightedValue", null)
      },

      clearInputState({refs}) {
        refs.set("inputState", {autoHighlight: false, focused: false})
      },

      clearItem({computed, context, event}) {
        const selection = computed("selection")
        if (event.value) {
          const value = selection.deselect(event.value)
          context.set("value", Array.from(value))
        }
      },

      clearSelectedItems({context}) {
        context.set("value", [])
      },

      highlightFirstValue({context, prop}) {
        context.set("highlightedValue", prop("collection").firstValue ?? null)
      },

      highlightLastValue({context, prop}) {
        context.set("highlightedValue", prop("collection").lastValue ?? null)
      },

      highlightMatchingItem({context, event, prop, refs}) {
        const value = prop("collection").search(event.key, {
          currentValue: context.get("highlightedValue"),
          state: refs.get("typeahead"),
        })

        if (value == null) {
          return
        }
        context.set("highlightedValue", value)
      },

      highlightNextValue({context, prop}) {
        const collection = prop("collection")
        const highlightedValue = context.get("highlightedValue")
        let nextValue: string | null = null

        if (isGridCollection(collection) && highlightedValue) {
          nextValue = collection.getNextRowValue(highlightedValue)
        } else if (highlightedValue) {
          nextValue = collection.getNextValue(highlightedValue)
        }

        if (!nextValue && (prop("loopFocus") || !highlightedValue)) {
          nextValue = collection.firstValue
        }

        if (!nextValue) {
          return
        }
        context.set("highlightedValue", nextValue)
      },

      highlightPreviousValue({context, prop}) {
        const collection = prop("collection")
        const highlightedValue = context.get("highlightedValue")
        let nextValue: string | null = null

        if (isGridCollection(collection) && highlightedValue) {
          nextValue = collection.getPreviousRowValue(highlightedValue)
        } else if (highlightedValue) {
          nextValue = collection.getPreviousValue(highlightedValue)
        }

        if (!nextValue && (prop("loopFocus") || !highlightedValue)) {
          nextValue = collection.lastValue
        }

        if (!nextValue) {
          return
        }
        context.set("highlightedValue", nextValue)
      },

      selectHighlightedItem({computed, context, event, prop}) {
        const value = event.value ?? context.get("highlightedValue")

        const collection = prop("collection")
        if (value == null || !collection.has(value)) {
          return
        }

        const selection = computed("selection")

        if (event.shiftKey && computed("multiple") && event.anchorValue) {
          const next = selection.extendSelection(
            collection,
            event.anchorValue,
            value,
          )
          invokeOnSelect(selection, next, prop("onSelect"))
          context.set("value", Array.from(next))
        } else {
          const next = selection.select(collection, value, event.metaKey)
          invokeOnSelect(selection, next, prop("onSelect"))
          context.set("value", Array.from(next))
        }
      },

      selectItem({computed, context, event, prop}) {
        const collection = prop("collection")
        const selection = computed("selection")

        const next = selection.select(collection, event.value)
        invokeOnSelect(selection, next, prop("onSelect"))

        context.set("value", Array.from(next))
      },

      selectWithKeyboard({computed, context, event, prop}) {
        const selection = computed("selection")
        const collection = prop("collection")

        if (
          event.shiftKey &&
          computed("multiple") &&
          event.anchorValue &&
          event.value
        ) {
          const next = selection.extendSelection(
            collection,
            event.anchorValue,
            event.value,
          )
          invokeOnSelect(selection, next, prop("onSelect"))
          context.set("value", Array.from(next))
          return
        }

        if (prop("selectOnHighlight")) {
          const next = selection.replaceSelection(collection, event.value)
          invokeOnSelect(selection, next, prop("onSelect"))
          context.set("value", Array.from(next))
        }
      },

      setDefaultHighlightedValue({context, prop}) {
        const collection = prop("collection")
        const firstValue = collection.firstValue
        if (firstValue != null) {
          context.set("highlightedValue", firstValue)
        }
      },

      setFocused({context}) {
        context.set("focused", true)
      },

      setHighlightedItem({context, event}) {
        context.set("highlightedValue", event.value)
      },

      setInputState({event, refs}) {
        refs.set("inputState", {
          autoHighlight: !!event.autoHighlight,
          focused: true,
        })
      },

      setSelectedItems({context, event}) {
        context.set("value", event.value)
      },

      syncHighlightedItem({context, prop}) {
        const collection = prop("collection")
        const highlightedValue = context.get("highlightedValue")
        const highlightedItem = highlightedValue
          ? collection.find(highlightedValue)
          : null
        context.set("highlightedItem", highlightedItem, null)
      },

      syncHighlightedValue({context, prop, refs}) {
        const collection = prop("collection")
        const highlightedValue = context.get("highlightedValue")
        const {autoHighlight} = refs.get("inputState")

        // when autoHighlight is enabled, always highlight first item on collection
        // change
        if (autoHighlight) {
          queueMicrotask(() => {
            context.set(
              "highlightedValue",
              prop("collection").firstValue ?? null,
            )
          })
          return
        }

        // if highlighted value is no longer in collection, clear it
        if (highlightedValue != null && !collection.has(highlightedValue)) {
          queueMicrotask(() => {
            context.set("highlightedValue", null)
          })
        }
      },

      syncSelectedItems({context, prop}) {
        const next = deriveSelectionState({
          collection: prop("collection"),
          selectedItemMap: context.get("selectedItemMap"),
          values: context.get("value"),
        })
        context.set("selectedItemMap", next.nextSelectedItemMap)
      },
    },
    guards: {
      hasHighlightedValue: ({context}) =>
        context.get("highlightedValue") != null,
      hasSelectedValue: ({context}) => context.get("value").length > 0,
    },
  })

const diff = (a: Set<string>, b: Set<string>) => {
  const result = new Set(a)
  for (const item of b) {
    result.delete(item)
  }
  return result
}

function invokeOnSelect(
  current: Set<string>,
  next: Set<string>,
  onSelect?: (details: ListboxSelectionDetails) => void,
) {
  const added = diff(next, current)
  for (const item of added) {
    onSelect?.({value: item})
  }
}
