// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {Locale} from "@qualcomm-ui/utils/direction"

export const [LocaleContextProvider, useLocaleContext] =
  createGuardedContext<Locale>({
    defaultValue: {dir: "ltr", locale: "en-US"},
    hookName: "useLocaleContext",
    name: "LocaleContext",
    providerName: "<LocaleProvider />",
    strict: false,
  })
