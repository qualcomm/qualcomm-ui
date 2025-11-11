// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createPasswordInputApi,
  type PasswordInputApiProps,
  passwordInputMachine,
} from "@qualcomm-ui/core/password-input"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {usePasswordInputContext} from "./password-input-context"

export function usePasswordInput(props: PasswordInputApiProps) {
  const machine = useMachine(passwordInputMachine, props)

  return createPasswordInputApi(machine, normalizeProps)
}

export function usePasswordInputLabel({id}: IdProp) {
  const context = usePasswordInputContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePasswordInputInput({id}: IdProp) {
  const context = usePasswordInputContext()
  return context.getInputBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePasswordInputErrorText({id}: IdProp) {
  const context = usePasswordInputContext()
  return context.getErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePasswordInputHint({id}: IdProp) {
  const context = usePasswordInputContext()
  return context.getHintBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePasswordInputVisibilityTrigger({id}: IdProp) {
  const context = usePasswordInputContext()
  return context.getVisibilityTriggerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePasswordInputClearTrigger() {
  const context = usePasswordInputContext()
  return context.getClearTriggerBindings()
}

export function usePasswordInputInputGroup() {
  const context = usePasswordInputContext()
  return context.getInputGroupBindings()
}

export function usePasswordInputErrorIndicator() {
  const context = usePasswordInputContext()
  return context.getErrorIndicatorBindings()
}
