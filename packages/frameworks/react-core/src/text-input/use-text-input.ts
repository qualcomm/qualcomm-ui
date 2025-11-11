// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createTextInputApi,
  type TextInputApiProps,
  textInputMachine,
} from "@qualcomm-ui/core/text-input"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useTextInputContext} from "./text-input-context"

export function useTextInput(props: TextInputApiProps) {
  const machine = useMachine(textInputMachine, props)

  return createTextInputApi(machine, normalizeProps)
}

export function useTextInputInputGroup() {
  const context = useTextInputContext()
  return context.getInputGroupBindings()
}

export function useTextInputLabel({id}: IdProp) {
  const context = useTextInputContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextInputInput({id}: IdProp) {
  const context = useTextInputContext()
  return context.getInputBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextInputErrorText({id}: IdProp) {
  const context = useTextInputContext()
  return context.getErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextInputHint({id}: IdProp) {
  const context = useTextInputContext()
  return context.getHintBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextInputClearTrigger() {
  const context = useTextInputContext()
  return context.getClearTriggerBindings()
}
