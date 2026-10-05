// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

/**
 * Contextual button props. Explicit button props override these values.
 */
export const [ButtonPropsContextProvider, useButtonPropsContext] =
  createGuardedContext<QdsButtonApiProps>({
    hookName: "useButtonPropsContext",
    providerName: "<ButtonPropsContextProvider>",
    strict: false,
  })
