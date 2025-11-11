// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {AccordionApi} from "@qualcomm-ui/core/accordion"

@Injectable()
export class AccordionContextService extends BaseApiContextService<AccordionApi> {}

export const [ACCORDION_CONTEXT, useAccordionContext, provideAccordionContext] =
  createApiContext<AccordionApi>("AccordionContext", AccordionContextService)
