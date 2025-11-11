// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useSelectContext} from "./select-context"

export function useSelectClearTrigger(props: IdProp) {
  const context = useSelectContext()
  return context.getClearTriggerBindings({
    id: useControlledId(props.id),
    onDestroy: useOnDestroy(),
  })
}

export function useSelectLabel(props: IdProp) {
  const context = useSelectContext()
  return context.getLabelBindings({
    id: useControlledId(props.id),
    onDestroy: useOnDestroy(),
  })
}

export function useSelectHint(props: IdProp) {
  const context = useSelectContext()
  return context.getHintBindings({
    id: useControlledId(props.id),
    onDestroy: useOnDestroy(),
  })
}

export function useSelectErrorText(props: IdProp) {
  const context = useSelectContext()
  return context.getErrorTextBindings({
    id: useControlledId(props.id),
    onDestroy: useOnDestroy(),
  })
}

export function useSelectIndicator() {
  const context = useSelectContext()
  return context.getIndicatorBindings()
}
