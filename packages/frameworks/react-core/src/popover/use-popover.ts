// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createPopoverApi,
  type PopoverAnchorBindings,
  type PopoverApi,
  type PopoverApiProps,
  type PopoverArrowBindings,
  type PopoverArrowTipBindings,
  type PopoverCloseTriggerBindings,
  type PopoverDescriptionBindings,
  type PopoverIndicatorBindings,
  type PopoverLabelBindings,
  popoverMachine,
  type PopoverTriggerBindings,
} from "@qualcomm-ui/core/popover"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {usePopoverContext} from "./popover-context"

export function usePopover(props: PopoverApiProps): PopoverApi {
  const config = useMachine(popoverMachine, props)
  return createPopoverApi(config, normalizeProps)
}

export function usePopoverArrow({id}: IdProp): PopoverArrowBindings {
  const context = usePopoverContext()
  return context.getArrowBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePopoverArrowTip(): PopoverArrowTipBindings {
  const context = usePopoverContext()
  return context.getArrowTipBindings()
}

export function usePopoverDescription({
  id,
}: IdProp): PopoverDescriptionBindings {
  const context = usePopoverContext()
  return context.getDescriptionBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePopoverIndicator(): PopoverIndicatorBindings {
  const context = usePopoverContext()
  return context.getIndicatorBindings()
}

export function usePopoverLabel({id}: IdProp): PopoverLabelBindings {
  const context = usePopoverContext()
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePopoverTrigger({id}: IdProp): PopoverTriggerBindings {
  const context = usePopoverContext()
  return context.getTriggerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePopoverAnchor({id}: IdProp): PopoverAnchorBindings {
  const context = usePopoverContext()
  return context.getAnchorBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function usePopoverCloseTrigger({
  id,
}: IdProp): PopoverCloseTriggerBindings {
  const context = usePopoverContext()
  return context.getCloseTriggerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
