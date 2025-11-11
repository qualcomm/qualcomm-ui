// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type CheckboxApi,
  type CheckboxApiProps,
  type CheckboxErrorTextBindings,
  type CheckboxIndicatorBindings,
  checkboxMachine,
  createCheckboxApi,
} from "@qualcomm-ui/core/checkbox"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useCheckboxContext} from "./checkbox-context"

export function useCheckbox(props: CheckboxApiProps): CheckboxApi {
  const machine = useMachine(checkboxMachine, props)

  return createCheckboxApi(machine, normalizeProps)
}

export function useCheckboxLabel({id}: IdProp) {
  const context = useCheckboxContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useCheckboxHiddenInput({id}: IdProp) {
  const context = useCheckboxContext()
  return context.getHiddenInputBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useCheckboxControl({id}: IdProp) {
  const context = useCheckboxContext()
  return context.getControlBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export interface UseCheckboxIndicator {
  contextProps: CheckboxIndicatorBindings
  indeterminate: boolean | undefined
}

export function useCheckboxIndicator(): UseCheckboxIndicator {
  const context = useCheckboxContext()
  return {
    contextProps: context.getIndicatorBindings(),
    indeterminate: context.indeterminate,
  }
}

export function useCheckboxErrorText({id}: IdProp): CheckboxErrorTextBindings {
  const context = useCheckboxContext()
  return context.getErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
