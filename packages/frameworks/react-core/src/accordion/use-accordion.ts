// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type AccordionApi,
  type AccordionApiProps,
  type AccordionItemApiProps,
  type AccordionItemBindings,
  type AccordionItemContentBindings,
  type AccordionItemIndicatorBindings,
  type AccordionItemSecondaryTextBindings,
  type AccordionItemTextBindings,
  type AccordionItemTriggerBindings,
  accordionMachine,
  createAccordionApi,
} from "@qualcomm-ui/core/accordion"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"

import {useAccordionContext, useAccordionItemContext} from "./accordion-context"

export function useAccordion(props: AccordionApiProps): AccordionApi {
  const machine = useMachine(accordionMachine, props)
  return createAccordionApi(machine, normalizeProps)
}

export function useAccordionItem({
  disabled,
  id,
  value,
}: IdProp & AccordionItemApiProps): AccordionItemBindings {
  const context = useAccordionContext()
  return context.getAccordionItemBindings({
    disabled,
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
    value,
  })
}

export function useAccordionItemTrigger({
  id,
}: IdProp): AccordionItemTriggerBindings {
  const context = useAccordionContext()
  const itemContext = useAccordionItemContext()
  return context.getAccordionItemTriggerBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
    ...itemContext,
  })
}

export function useAccordionItemText(): AccordionItemTextBindings {
  const context = useAccordionContext()
  const itemContext = useAccordionItemContext()
  return context.getAccordionItemTextBindings(itemContext)
}

export function useAccordionItemSecondaryText(): AccordionItemSecondaryTextBindings {
  const context = useAccordionContext()
  const itemContext = useAccordionItemContext()
  return context.getAccordionItemSecondaryTextBindings(itemContext)
}

export function useAccordionItemIndicator(): AccordionItemIndicatorBindings {
  const context = useAccordionContext()
  const itemContext = useAccordionItemContext()
  return context.getAccordionItemIndicatorBindings(itemContext)
}

export function useAccordionItemContent({
  id,
}: IdProp): AccordionItemContentBindings {
  const context = useAccordionContext()
  const itemContext = useAccordionItemContext()
  return context.getAccordionItemContentBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
    ...itemContext,
  })
}
