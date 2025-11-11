// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  AccordionApi,
  AccordionItemApiProps,
} from "@qualcomm-ui/core/accordion"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export const [AccordionContextProvider, useAccordionContext] =
  createGuardedContext<AccordionApi>({
    hookName: "useAccordionContext",
    providerName: "<AccordionContextProvider>",
    strict: true,
  })

export const [AccordionItemContextProvider, useAccordionItemContext] =
  createGuardedContext<AccordionItemApiProps>({
    hookName: "useAccordionItemContext",
    providerName: "<AccordionItemContextProvider>",
    strict: true,
  })

export function useAccordionItemState() {
  const accordionContext = useAccordionContext()
  const context = useAccordionItemContext()
  return accordionContext.getAccordionItemState(context)
}
