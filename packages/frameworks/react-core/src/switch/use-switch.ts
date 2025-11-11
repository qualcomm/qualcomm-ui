// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createSwitchApi,
  type SwitchApi,
  type SwitchApiProps,
  type SwitchErrorTextBindings,
  switchMachine,
  type SwitchThumbBindings,
} from "@qualcomm-ui/core/switch"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useSwitchContext} from "./switch-context"

export function useSwitch(props: SwitchApiProps): SwitchApi {
  const machine = useMachine(switchMachine, props)

  return createSwitchApi(machine, normalizeProps)
}

export function useSwitchLabel({id}: IdProp) {
  const context = useSwitchContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSwitchHiddenInput({id}: IdProp) {
  const context = useSwitchContext()
  return context.getHiddenInputBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useSwitchControl() {
  const context = useSwitchContext()
  return context.getControlBindings()
}

export function useSwitchThumb(): SwitchThumbBindings {
  const context = useSwitchContext()
  return context.getThumbBindings()
}

export function useSwitchErrorText({id}: IdProp): SwitchErrorTextBindings {
  const context = useSwitchContext()
  return context.getErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
