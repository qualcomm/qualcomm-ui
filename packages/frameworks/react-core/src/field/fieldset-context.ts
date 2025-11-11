// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Dispatch, SetStateAction} from "react"

import type {FieldsetApi, FieldsetElementIds} from "@qualcomm-ui/core/fieldset"
import {createGuardedContext} from "@qualcomm-ui/react-core/context"

export interface FieldsetContextValue extends FieldsetApi {
  ids: FieldsetElementIds & {
    setErrorTextId: Dispatch<SetStateAction<string | undefined>>
    setHintId: Dispatch<SetStateAction<string | undefined>>
  }
}

export const [FieldsetContextProvider, useFieldsetContext] =
  createGuardedContext<FieldsetContextValue>({
    hookName: "useFieldsetContext",
    providerName: "<FieldsetContextProvider>",
    strict: false,
  })
