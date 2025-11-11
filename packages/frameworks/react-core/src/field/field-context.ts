// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {FieldApi} from "@qualcomm-ui/core/field"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface FieldContextValue extends FieldApi {}

export const [FieldContextProvider, useFieldContext] = createGuardedContext<
  FieldContextValue | undefined
>({
  hookName: "useFieldContext",
  providerName: "<FieldContextProvider>",
  strict: false,
})
