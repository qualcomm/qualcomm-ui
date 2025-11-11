// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createRadioApi,
  type RadioApi,
  type RadioApiProps,
  type RadioGroupErrorTextBindings,
  type RadioGroupItemsBindings,
  type RadioGroupLabelBindings,
  type RadioItemBindings,
  type RadioItemContext,
  type RadioItemControlBindings,
  type RadioItemHiddenInputBindings,
  type RadioItemLabelBindings,
  radioMachine,
} from "@qualcomm-ui/core/radio"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useRadioContext, useRadioItemContext} from "./radio-context"

export function useRadio(props: RadioApiProps): RadioApi {
  const machine = useMachine(radioMachine, props)
  return createRadioApi(machine, normalizeProps)
}

export function useRadioGroupItems(): RadioGroupItemsBindings {
  const context = useRadioContext()
  return context.getGroupItemsBindings()
}

export function useRadioItem({
  disabled,
  id,
  value,
}: RadioItemContext & IdProp): {
  bindings: RadioItemBindings
  itemContext: RadioItemContext
} {
  const context = useRadioContext()

  return {
    bindings: context.getRadioBindings({
      disabled,
      id: useControlledId(id),
      onDestroy: useOnDestroy(),
      value,
    }),
    itemContext: {
      disabled: disabled || false,
      value,
    },
  }
}

export function useRadioGroupErrorText({
  id,
}: IdProp): RadioGroupErrorTextBindings {
  const context = useRadioContext()
  return context.getGroupErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useRadioItemLabel({id}: IdProp): RadioItemLabelBindings {
  const context = useRadioContext()
  const itemContext = useRadioItemContext()
  return context.getRadioLabelBindings({
    ...itemContext,
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useRadioItemHiddenInput({
  id,
}: IdProp): RadioItemHiddenInputBindings {
  const context = useRadioContext()
  const itemContext = useRadioItemContext()
  return context.getRadioHiddenInputBindings({
    ...itemContext,
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useRadioGroupLabel({id}: IdProp): RadioGroupLabelBindings {
  const context = useRadioContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useRadioItemControl(): RadioItemControlBindings {
  const context = useRadioContext()
  const itemContext = useRadioItemContext()
  return context.getRadioControlBindings({...itemContext})
}
