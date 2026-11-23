// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useRef, useState} from "react"

import {createTextInputFilterApi} from "@qualcomm-ui/core/filter-control"
import type {TextFilterDefinition} from "@qualcomm-ui/core/filters"
import {
  useFilter,
  useFilterSetContext,
} from "@qualcomm-ui/react-core/filter-set"
import {TextInput, type TextInputProps} from "@qualcomm-ui/react/text-input"

import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface TextInputFilterProps extends Omit<
  TextInputProps,
  "defaultValue" | "onValueChange" | "value"
> {
  /**
   * Milliseconds to wait after typing stops before committing in `auto`
   * apply mode. Manual mode writes the draft on every keystroke.
   *
   * @default 300
   */
  debounce?: number | undefined
}

/**
 * A text input that captures free text. Writes a `string`.
 */
export function TextInputFilter({
  debounce,
  ...props
}: TextInputFilterProps): ReactElement {
  const {applyMode} = useFilterSetContext()
  const [pending, setPending] = useState<string | null>(null)
  const api = createTextInputFilterApi(useFilter<TextFilterDefinition>(), {
    applyMode,
    debounce,
    pending,
  })
  const qdsContext = useQdsFilterControlContext()
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  function handleValueChange(value: string) {
    clearTimeout(timeout.current)
    if (!api.commitDelay) {
      setPending(null)
      api.setValue(value)
      return
    }
    setPending(value)
    timeout.current = setTimeout(() => {
      setPending(null)
      api.setValue(value)
    }, api.commitDelay)
  }

  return (
    <TextInput
      {...api.getLabelProps()}
      onValueChange={handleValueChange}
      size={qdsContext.size}
      value={api.value}
      {...props}
    />
  )
}
