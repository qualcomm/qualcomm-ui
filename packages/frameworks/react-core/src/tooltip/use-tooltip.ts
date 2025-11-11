// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createTooltipApi,
  type TooltipApi,
  type TooltipApiProps,
  type TooltipArrowBindings,
  type TooltipArrowTipBindings,
  type TooltipContentBindings,
  tooltipMachine,
  type TooltipPositionerBindings,
  type TooltipTriggerBindings,
} from "@qualcomm-ui/core/tooltip"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useTooltipContext} from "./tooltip-context"

export function useTooltip(props: TooltipApiProps): TooltipApi {
  const config = useMachine(tooltipMachine, props)
  return createTooltipApi(config, normalizeProps)
}

export function useTooltipArrow({id}: IdProp): TooltipArrowBindings {
  const context = useTooltipContext()
  return context.getTooltipArrowBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTooltipArrowTip(): TooltipArrowTipBindings {
  const context = useTooltipContext()
  return context.getTooltipArrowTipBindings()
}

export function useTooltipPositioner({id}: IdProp): TooltipPositionerBindings {
  const context = useTooltipContext()
  return context.getTooltipPositionerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTooltipContent({id}: IdProp): TooltipContentBindings {
  const context = useTooltipContext()
  return context.getTooltipContentBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useTooltipTrigger({id}: IdProp): TooltipTriggerBindings {
  const context = useTooltipContext()
  return context.getTooltipTriggerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
