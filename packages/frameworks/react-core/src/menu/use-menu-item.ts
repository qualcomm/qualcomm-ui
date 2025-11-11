// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect} from "react"

import type {
  ItemGroupContext,
  ItemProps,
  ItemState,
  MenuItemBindings,
  MenuItemGroupBindings,
  MenuItemGroupLabelBindings,
  MenuItemIndicatorBindings,
  MenuItemLabelBindings,
  MenuOptionItemBindings,
  MenuOptionItemControlBindings,
  MenuTriggerItemBindings,
  OptionItemProps,
  RadioItemGroupContext,
} from "@qualcomm-ui/core/menu"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {
  useControlledId,
  useControlledState,
} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import type {Optional} from "@qualcomm-ui/utils/guard"

import {useMenuContext} from "./menu-context"
import {useMenuItemContext, useMenuOptionItemContext} from "./menu-item-context"
import {
  useMenuItemGroupContext,
  useMenuRadioItemGroupContext,
} from "./menu-item-group-context"
import {useMenuTriggerContext} from "./menu-trigger-context"

export interface UseMenuItemReturn {
  bindings: MenuItemBindings
  itemContextValue: ItemState & ItemProps
}

export function useMenuItem(props: ItemProps): UseMenuItemReturn {
  const context = useMenuContext()
  const itemState = context.getItemState(props)
  useEffect(() => {
    return context.addItemListener({
      id: itemState.id,
      onSelect: props.onSelect,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemState.id, props.onSelect])

  return {
    bindings: context.getItemBindings(props),
    itemContextValue: {...props, ...itemState},
  }
}

export interface UseMenuTriggerItemReturn {
  bindings: MenuTriggerItemBindings | undefined
  itemContextValue: ItemState & ItemProps
}

export function useMenuTriggerItem(
  props: ItemProps & IdProp,
): UseMenuTriggerItemReturn {
  const context = useMenuContext()
  const itemState = context.getItemState(props)
  const menuTriggerContext = useMenuTriggerContext()
  return {
    bindings: menuTriggerContext({
      id: useControlledId(props.id),
      onDestroy: useOnDestroy(),
    }),
    itemContextValue: {...props, ...itemState},
  }
}

export interface UseMenuRadioItemReturn {
  bindings: MenuOptionItemBindings
  optionItemContextValue: ItemState & OptionItemProps
}

export function useMenuRadioItem(props: ItemProps): UseMenuRadioItemReturn {
  const context = useMenuContext()
  const itemGroup = useMenuRadioItemGroupContext()
  const optionItemProps: OptionItemProps = {
    ...props,
    checked: itemGroup.value === props.value,
    onCheckedChange: () => itemGroup.onValueChange?.(props.value),
    type: "radio",
  }
  return {
    bindings: context.getOptionItemBindings(optionItemProps),
    optionItemContextValue: {
      ...optionItemProps,
      ...context.getItemState(props),
    },
  }
}

export interface UseMenuCheckboxItemReturn {
  bindings: MenuOptionItemBindings
  optionItemContextValue: ItemState & OptionItemProps
}

export function useMenuCheckboxItem(
  props: OptionItemProps,
): UseMenuCheckboxItemReturn {
  const context = useMenuContext()
  const [checked, setChecked] = useControlledState<boolean>({
    controlled: props.checked,
    defaultValue: false,
    name: "MenuCheckboxItem",
    onChangeProp: props.onCheckedChange,
  })
  const optionItemProps: OptionItemProps = {
    ...props,
    checked,
    onCheckedChange: (value) => {
      setChecked(value)
    },
    type: "checkbox",
  }
  return {
    bindings: context.getOptionItemBindings(optionItemProps),
    optionItemContextValue: {
      ...context.getItemState(props),
      ...optionItemProps,
    },
  }
}

export function useMenuOptionItemControl(): MenuOptionItemControlBindings {
  const context = useMenuContext()
  const optionProps = useMenuOptionItemContext()
  return context.getOptionItemControlBindings(optionProps)
}

export interface UseMenuItemGroupReturn {
  bindings: MenuItemGroupBindings
  itemGroupContextValue: ItemGroupContext
}

export function useMenuItemGroup(
  props: Optional<ItemGroupContext, "id">,
): UseMenuItemGroupReturn {
  const context = useMenuContext()

  const itemGroupContextValue: ItemGroupContext = {
    id: useControlledId(props.id),
  }

  return {
    bindings: context.getItemGroupBindings(itemGroupContextValue),
    itemGroupContextValue,
  }
}

export interface UseMenuRadioItemGroupReturn {
  bindings: MenuItemGroupBindings
  itemGroupContextValue: ItemGroupContext
}

export function useMenuRadioItemGroup(
  props: Optional<RadioItemGroupContext, "id">,
): UseMenuRadioItemGroupReturn {
  const context = useMenuContext()
  const id = useControlledId(props.id)
  const [value, setValue] = useControlledState<string>({
    controlled: props.value,
    defaultValue: "",
    name: "MenuItemGroup",
    onChangeProp: props.onValueChange,
  })
  const itemGroupContextValue: RadioItemGroupContext = {
    ...props,
    id,
    onValueChange: setValue,
    value,
  }

  return {
    bindings: context.getItemGroupBindings(itemGroupContextValue),
    itemGroupContextValue,
  }
}

export function useMenuItemGroupLabel(): MenuItemGroupLabelBindings {
  const context = useMenuContext()
  const groupContext = useMenuItemGroupContext(false)
  const optionGroupContext = useMenuRadioItemGroupContext(false)
  return context.getItemGroupLabelBindings({
    htmlFor: groupContext?.id || optionGroupContext?.id,
  })
}

export function useMenuItemIndicator(): MenuItemIndicatorBindings {
  const context = useMenuContext()
  const menuItemContext = useMenuItemContext()
  return context.getItemIndicatorBindings(menuItemContext)
}

export function useMenuItemLabel(): MenuItemLabelBindings {
  const context = useMenuContext()
  const menuItemContext = useMenuItemContext(false)
  const optionItemContext = useMenuOptionItemContext(false)
  return context.getItemLabelBindings(
    optionItemContext || menuItemContext || ({} as ItemProps),
  )
}
