// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {
  QdsButtonApiProps,
  QdsButtonGroupApiProps,
} from "@qualcomm-ui/qds-core/button"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"
import type {Explicit} from "@qualcomm-ui/utils/guard"

interface ButtonGroupContextValue
  extends Explicit<
    Pick<
      QdsButtonGroupApiProps,
      keyof QdsButtonGroupApiProps & keyof QdsButtonApiProps
    >
  > {}

export const [ButtonGroupContextProvider, useButtonGroupContext] =
  createGuardedContext<ButtonGroupContextValue>({
    hookName: "useButtonGroupContext",
    providerName: "<ButtonGroupContextProvider>",
    strict: false,
  })
