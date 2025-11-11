// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback, useMemo, useState} from "react"

import type {
  FieldApiProps,
  FieldControlBindings,
  FieldErrorTextBindings,
  FieldHintBindings,
  FieldLabelBindings,
  FieldRequiredIndicatorBindings,
  FieldRootBindings,
} from "@qualcomm-ui/core/field"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {IdProp} from "@qualcomm-ui/react-core/system"
import {booleanAriaAttr, booleanDataAttr} from "@qualcomm-ui/utils/attributes"

import {type FieldContextValue, useFieldContext} from "./field-context"
import {useFieldsetContext} from "./fieldset-context"

const scope: {"data-scope": "field"} = {
  "data-scope": "field",
}

export function useField(props: FieldApiProps): FieldContextValue {
  const fieldsetDisabled = useFieldsetContext()?.disabled
  const {
    dir = "ltr",
    disabled = Boolean(fieldsetDisabled),
    invalid = false,
    readOnly = false,
    required = false,
  } = props

  const [controlId, setControlId] = useState<string>("")
  const [errorTextId, setErrorTextId] = useState<string | undefined>()
  const [hintId, setHintId] = useState<string | undefined>()
  const [labelId, setLabelId] = useState<string | undefined>()

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

  const getRootBindings = useCallback<() => FieldRootBindings>(
    () => ({
      ...scope,
      "data-disabled": booleanDataAttr(disabled),
      "data-invalid": booleanDataAttr(invalid),
      "data-part": "root",
      "data-readonly": booleanDataAttr(readOnly),
      dir,
      role: "group",
    }),
    [dir, disabled, invalid, readOnly],
  )

  const getLabelBindings = useCallback<() => FieldLabelBindings>(
    () => ({
      ...scope,
      "data-disabled": booleanDataAttr(disabled),
      "data-invalid": booleanDataAttr(invalid),
      "data-part": "label",
      "data-required": booleanDataAttr(required),
      dir,
      htmlFor: controlId,
      id: labelId!,
    }),
    [controlId, dir, disabled, invalid, labelId, required],
  )

  const getControlBindings = useCallback<() => FieldControlBindings>(
    () => ({
      ...scope,
      "aria-describedby": labelIds,
      "aria-invalid": booleanAriaAttr(invalid),
      "data-disabled": booleanDataAttr(disabled),
      "data-invalid": booleanDataAttr(invalid),
      "data-part": "control",
      "data-required": booleanDataAttr(required),
      dir,
      disabled,
      id: controlId,
      readOnly,
      required: booleanDataAttr(required),
    }),
    [dir, labelIds, invalid, disabled, required, controlId, readOnly],
  )

  const getHintBindings = useCallback<() => FieldHintBindings>(
    () => ({
      ...scope,
      "data-disabled": booleanDataAttr(disabled),
      "data-part": "hint",
      dir,
      id: hintId!,
    }),
    [dir, disabled, hintId],
  )

  const getErrorTextBindings = useCallback<() => FieldErrorTextBindings>(
    () => ({
      ...scope,
      "aria-live": "polite",
      "data-disabled": booleanDataAttr(disabled),
      "data-part": "error-text",
      dir,
      id: errorTextId!,
    }),
    [dir, disabled, errorTextId],
  )

  const getRequiredIndicatorBindings = useCallback<
    () => FieldRequiredIndicatorBindings
  >(
    () => ({
      ...scope,
      "aria-hidden": "true",
      "data-part": "required-indicator",
      dir,
    }),
    [dir],
  )

  return useMemo<FieldContextValue>(
    () => ({
      disabled,
      getControlBindings,
      getErrorTextBindings,
      getHintBindings,
      getLabelBindings,
      getRequiredIndicatorBindings,
      getRootBindings,
      ids: {
        control: controlId,
        errorText: errorTextId,
        hint: hintId,
        label: labelId,
        setControlId,
        setErrorTextId,
        setHintId,
        setLabelId,
      },
      invalid,
      readOnly,
      required,
    }),
    [
      controlId,
      disabled,
      errorTextId,
      getControlBindings,
      getErrorTextBindings,
      getHintBindings,
      getLabelBindings,
      getRequiredIndicatorBindings,
      getRootBindings,
      hintId,
      invalid,
      labelId,
      readOnly,
      required,
    ],
  )
}

export function useFieldLabel({id}: IdProp): FieldLabelBindings {
  const context = useFieldContext(true)!
  return context.getLabelBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useFieldControl({id}: IdProp): FieldControlBindings {
  const context = useFieldContext(true)!
  return context.getControlBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useFieldErrorText({id}: IdProp): FieldErrorTextBindings {
  const context = useFieldContext(true)!
  return context.getErrorTextBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}

export function useFieldHint({id}: IdProp): FieldHintBindings {
  const context = useFieldContext(true)!
  return context.getHintBindings({
    id: useControlledId(id),
    onDestroy: useOnDestroy(),
  })
}
