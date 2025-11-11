// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback, useMemo, useState} from "react"

import type {
  FieldsetApiProps,
  FieldsetErrorTextBindings,
  FieldsetHintBindings,
  FieldsetLegendBindings,
  FieldsetRootBindings,
} from "@qualcomm-ui/core/fieldset"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {FieldsetContextValue} from "./fieldset-context"

const scope: Pick<FieldsetRootBindings, "data-scope"> = {
  "data-scope": "fieldset",
}

export function useFieldset(props: FieldsetApiProps): FieldsetContextValue {
  const {disabled = false, invalid = false} = props
  const [hintId, setHintId] = useState<string | undefined>(undefined)
  const [errorTextId, setErrorTextId] = useState<string | undefined>(undefined)

  const labelIds = useMemo(() => {
    const ids: string[] = []
    if (errorTextId && invalid) {
      ids.push(errorTextId)
    }
    if (hintId) {
      ids.push(hintId)
    }
    return ids.join(" ") || undefined
  }, [invalid, errorTextId, hintId])

  const getRootBindings = useCallback<() => FieldsetRootBindings>(
    () => ({
      ...scope,
      "aria-describedby": labelIds,
      "data-disabled": booleanDataAttr(disabled),
      "data-invalid": booleanDataAttr(invalid),
      disabled,
      role: "group",
    }),
    [disabled, invalid, labelIds],
  )

  const getLegendBindings = useCallback<() => FieldsetLegendBindings>(
    () => ({
      ...scope,
      "data-disabled": booleanDataAttr(disabled),
      "data-invalid": booleanDataAttr(invalid),
      "data-part": "legend",
    }),
    [disabled, invalid],
  )

  const getErrorTextBindings = useCallback<() => FieldsetErrorTextBindings>(
    () => ({
      ...scope,
      "aria-live": "polite",
      "data-disabled": booleanDataAttr(disabled),
      "data-part": "error-text",
      id: errorTextId,
    }),
    [disabled, errorTextId],
  )

  const getHintBindings = useCallback<() => FieldsetHintBindings>(
    () => ({
      ...scope,
      "data-disabled": booleanDataAttr(disabled),
      "data-part": "hint",
      id: hintId!,
    }),
    [disabled, hintId],
  )

  const ids: FieldsetContextValue["ids"] = useMemo(
    () => ({
      errorText: errorTextId,
      hint: hintId,
      setErrorTextId,
      setHintId,
    }),
    [errorTextId, hintId],
  )

  return useMemo<FieldsetContextValue>(
    () => ({
      disabled,
      getErrorTextBindings,
      getHintBindings,
      getLegendBindings,
      getRootBindings,
      ids,
      invalid,
    }),
    [
      disabled,
      getErrorTextBindings,
      getHintBindings,
      getLegendBindings,
      getRootBindings,
      ids,
      invalid,
    ],
  )
}
