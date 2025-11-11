// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type Ref, useCallback} from "react"

import {
  createMenuApi,
  type MenuApi,
  type MenuApiProps,
  type MenuArrowBindings,
  type MenuArrowTipBindings,
  type MenuContentBindings,
  type MenuContextTriggerBindings,
  menuMachine,
  type MenuPositionerBindings,
  type MenuSchema,
  type MenuSeparatorBindings,
  type MenuTriggerBindings,
  type MenuTriggerContextValue,
} from "@qualcomm-ui/core/menu"
import {useEffectOnce, useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {usePresenceContext} from "@qualcomm-ui/react-core/presence"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import type {Optional} from "@qualcomm-ui/utils/guard"
import type {IdRegistrationProps, Machine} from "@qualcomm-ui/utils/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useMenuContext} from "./menu-context"
import {useMenuMachineContext} from "./menu-machine-context"

export interface UseMenuReturn {
  api: MenuApi
  machine: Machine<MenuSchema>
  triggerItemContext: MenuTriggerContextValue
}

export function useMenu(props: Optional<MenuApiProps, "id">): UseMenuReturn {
  const parentApi = useMenuContext(false)
  const parentMachine = useMenuMachineContext(false)
  const id = useControlledId(props.id)

  const machine = useMachine(menuMachine, {...props, id})
  const api = createMenuApi(machine, normalizeProps)

  useEffectOnce(() => {
    if (!parentMachine) {
      return
    }
    if (!parentApi) {
      return
    }

    parentApi.setChild(machine)
    api.setParent(parentMachine)
  })

  const triggerItemContext: MenuTriggerContextValue = useCallback(
    (params: IdRegistrationProps) =>
      parentApi?.getTriggerItemBindings(api, params),
    [api, parentApi],
  )

  return {api, machine, triggerItemContext}
}

export function useMenuArrowTip(): MenuArrowTipBindings {
  const context = useMenuContext()
  return context.getArrowTipBindings()
}

export function useMenuArrow(): MenuArrowBindings {
  const context = useMenuContext()
  return context.getArrowBindings()
}

export type UseMenuContentReturn =
  | (MenuContentBindings & {ref: Ref<any>})
  | null

export function useMenuContent({id: idProp}: IdProp): UseMenuContentReturn {
  const context = useMenuContext()
  const presence = usePresenceContext()
  const id = useControlledId(idProp)

  if (presence.unmounted) {
    return null
  }

  return mergeProps(
    context.getContentBindings({id}),
    presence.getPresenceBindings(),
    {ref: presence.ref},
  )
}

export function useMenuContextTrigger({
  id,
}: IdProp): MenuContextTriggerBindings {
  const context = useMenuContext()
  return context.getContextTriggerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useMenuPositioner({
  id: idProp,
}: IdProp): MenuPositionerBindings | null {
  const context = useMenuContext()
  const presence = usePresenceContext()
  const id = useControlledId(idProp)

  if (presence.unmounted) {
    return null
  }

  return context.getPositionerBindings({id})
}

export function useMenuTrigger({id}: IdProp): MenuTriggerBindings {
  const context = useMenuContext()
  const presence = usePresenceContext()
  const bindings = context.getTriggerBindings({id: useControlledId(id)})
  return {
    ...bindings,
    "aria-controls": presence.unmounted ? undefined : bindings["aria-controls"],
  }
}

export function useMenuSeparator(): MenuSeparatorBindings {
  const context = useMenuContext()
  return context.getSeparatorBindings()
}
