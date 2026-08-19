import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {ListboxApiProps} from "./listbox.types.js"

export const listboxProps: (keyof ListboxApiProps)[] =
  createProps<ListboxApiProps>()(
    "collection",
    "defaultHighlightedValue",
    "defaultValue",
    "dir",
    "disabled",
    "deselectable",
    "disallowSelectAll",
    "getRootNode",
    "highlightedValue",
    "loopFocus",
    "onHighlightChange",
    "onSelect",
    "onValueChange",
    "orientation",
    "scrollToIndexFn",
    "selectionMode",
    "selectOnHighlight",
    "typeahead",
    "value",
  )

export const splitListboxProps: <Props extends ListboxApiProps>(
  props: Props,
) => [ListboxApiProps, Omit<Props, keyof ListboxApiProps>] =
  createSplitProps<ListboxApiProps>(listboxProps)
