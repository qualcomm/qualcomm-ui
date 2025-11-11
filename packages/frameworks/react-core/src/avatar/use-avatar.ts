// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type AvatarApi,
  type AvatarApiProps,
  type AvatarContentBindings,
  type AvatarImageBindings,
  avatarMachine,
  type AvatarStatusBindings,
  createAvatarApi,
} from "@qualcomm-ui/core/avatar"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useAvatarContext} from "./avatar-context"

export function useAvatar(props: AvatarApiProps): AvatarApi {
  const machine = useMachine(avatarMachine, props)
  return createAvatarApi(machine, normalizeProps)
}

export function useAvatarImage({id}: IdProp): AvatarImageBindings {
  const context = useAvatarContext()
  return context.getImageBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useAvatarContent({id}: IdProp): AvatarContentBindings {
  const context = useAvatarContext()
  return context.getContentBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useAvatarStatus({id}: IdProp): AvatarStatusBindings {
  const context = useAvatarContext()
  return context.getStatusBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
