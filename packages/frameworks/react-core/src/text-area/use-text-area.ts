// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createTextAreaApi,
  type TextAreaApiProps,
  textAreaMachine,
} from "@qualcomm-ui/core/text-area"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useTextAreaContext} from "./text-area-context.js"

export function useTextArea(props: TextAreaApiProps) {
  const machine = useMachine(textAreaMachine, props)
  return createTextAreaApi(machine, normalizeProps)
}

export function useTextAreaLabel({id}: IdProp) {
  const context = useTextAreaContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextAreaCounter({id}: IdProp) {
  const context = useTextAreaContext()
  return context.getCounterBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextAreaInput({id}: IdProp) {
  const context = useTextAreaContext()
  return context.getInputBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextAreaErrorText({id}: IdProp) {
  const context = useTextAreaContext()
  return context.getErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTextAreaHint({id}: IdProp) {
  const context = useTextAreaContext()
  return context.getHintBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
