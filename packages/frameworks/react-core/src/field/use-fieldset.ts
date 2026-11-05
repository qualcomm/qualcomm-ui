// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback, useMemo, useState} from "react"

import {
  fieldsetAnatomy,
  type FieldsetApiProps,
  type FieldsetErrorTextBindings,
  type FieldsetHintBindings,
  type FieldsetLegendBindings,
  type FieldsetRootBindings,
} from "@qualcomm-ui/core/fieldset"
import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {FieldsetContextValue} from "./fieldset-context.js"

const parts = fieldsetAnatomy.parts

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
      ...parts.root,
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
      ...parts.legend,
      "data-disabled": booleanDataAttr(disabled),
      "data-invalid": booleanDataAttr(invalid),
    }),
    [disabled, invalid],
  )

  const getErrorTextBindings = useCallback<() => FieldsetErrorTextBindings>(
    () => ({
      ...parts.errorText,
      "aria-live": "polite",
      "data-disabled": booleanDataAttr(disabled),
      id: errorTextId,
    }),
    [disabled, errorTextId],
  )

  const getHintBindings = useCallback<() => FieldsetHintBindings>(
    () => ({
      ...parts.hint,
      "data-disabled": booleanDataAttr(disabled),
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
