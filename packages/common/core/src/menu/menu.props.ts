import {createProps, createSplitProps} from "@qualcomm-ui/utils/object"

import type {ItemProps, MenuApiProps, OptionItemProps} from "./menu.types"

export const menuProps: (keyof MenuApiProps)[] = createProps<MenuApiProps>()(
  "anchorPoint",
  "closeOnSelect",
  "composite",
  "defaultHighlightedValue",
  "defaultOpen",
  "dir",
  "getRootNode",
  "highlightedValue",
  "id",
  "loopFocus",
  "navigate",
  "onEscapeKeyDown",
  "onFocusOutside",
  "onHighlightChange",
  "onInteractOutside",
  "onOpenChange",
  "onPointerDownOutside",
  "onRequestDismiss",
  "onSelect",
  "open",
  "positioning",
  "typeahead",
)

export const splitMenuProps: <Props extends MenuApiProps>(
  props: Props,
) => [MenuApiProps, Omit<Props, keyof MenuApiProps>] =
  createSplitProps<MenuApiProps>(menuProps)

export const menuItemProps: (keyof ItemProps)[] = createProps<ItemProps>()(
  "closeOnSelect",
  "disabled",
  "onSelect",
  "value",
  "valueText",
)

export const splitMenuItemProps: <Props extends ItemProps>(
  props: Props,
) => [ItemProps, Omit<Props, keyof ItemProps>] =
  createSplitProps<ItemProps>(menuItemProps)

export const menuOptionItemProps: (keyof OptionItemProps)[] =
  createProps<OptionItemProps>()(
    "closeOnSelect",
    "disabled",
    "checked",
    "onCheckedChange",
    "onSelect",
    "value",
    "type",
    "valueText",
  )

export const splitMenuOptionItemProps: <Props extends OptionItemProps>(
  props: Props,
) => [OptionItemProps, Omit<Props, keyof OptionItemProps>] =
  createSplitProps<OptionItemProps>(menuOptionItemProps)
