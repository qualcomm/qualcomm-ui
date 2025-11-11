// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Injectable} from "@angular/core"

import {
  type ApiContext,
  BaseApiContextService,
  createApiContext,
} from "@qualcomm-ui/angular-core/machine"
import type {Locale} from "@qualcomm-ui/utils/direction"

@Injectable()
export class LocaleContextService extends BaseApiContextService<Locale> {}

export const [
  LOCALE_CONTEXT,
  useLocaleContext,
  provideLocaleContext,
]: ApiContext<Locale> = createApiContext<Locale>(
  "LocaleContext",
  LocaleContextService,
  {dir: "ltr", locale: "en-US"},
)
