// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ResolvableButtonGroupProps} from "@qualcomm-ui/qds-core/button"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {Explicit} from "@qualcomm-ui/utils/guard"

type ButtonGroupContextValue = Explicit<ResolvableButtonGroupProps>

export const [ButtonGroupContextProvider, useButtonGroupContext] =
  createGuardedContext<ButtonGroupContextValue>({
    hookName: "useButtonGroupContext",
    providerName: "<ButtonGroupContextProvider>",
    strict: false,
  })
