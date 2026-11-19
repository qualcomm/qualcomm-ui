// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useRef, useState} from "react"

import type {TextFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {TextInput, type TextInputProps} from "@qualcomm-ui/react/text-input"

import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
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
  debounce = 300,
  ...props
}: TextInputFilterProps): ReactElement {
  const api = useFilterSetContext()
  const filter = useFilterWidget<TextFilterDefinition>(
    "TextInputFilter",
    "text",
  )
  const qdsContext = useQdsFilterControlContext()
  const [pending, setPending] = useState<string | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeout.current), [])

  function handleValueChange(value: string) {
    if (api.applyMode === "manual") {
      filter.setValue(value)
      return
    }
    setPending(value)
    clearTimeout(timeout.current)
    timeout.current = setTimeout(() => {
      setPending(null)
      filter.setValue(value)
    }, debounce)
  }

  return (
    <TextInput
      {...getFilterLabelProps(filter)}
      onValueChange={handleValueChange}
      size={qdsContext.size}
      value={pending ?? filter.value ?? ""}
      {...props}
    />
  )
}
