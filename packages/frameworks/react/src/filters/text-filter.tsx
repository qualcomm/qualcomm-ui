// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useEffect, useRef, useState} from "react"

import type {TextFilterDefinition} from "@qualcomm-ui/core/filters"
import {
  useFilterPanelContext,
  useFilterPanelFilter,
} from "@qualcomm-ui/react-core/filter-panel"
import {useQdsFilterPanelContext} from "@qualcomm-ui/react/filter-panel"
import {TextInput, type TextInputProps} from "@qualcomm-ui/react/text-input"

import {FilterSection, type FilterSectionProps} from "./filter-section.js"

export interface TextFilterControlProps extends Omit<
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
 * A text input that writes the entered text.
 */
export function TextFilterControl({
  debounce = 300,
  ...props
}: TextFilterControlProps): ReactElement {
  const api = useFilterPanelContext()
  const filter = useFilterPanelFilter<TextFilterDefinition>()
  const qdsContext = useQdsFilterPanelContext()
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
      aria-labelledby={filter.labelId}
      onValueChange={handleValueChange}
      size={qdsContext.controlSize}
      value={pending ?? filter.value ?? ""}
      {...props}
    />
  )
}

export interface TextFilterProps
  extends
    FilterSectionProps<TextFilterDefinition>,
    Omit<TextFilterControlProps, keyof FilterSectionProps> {}

/**
 * A filter that captures free text. Writes a `string`.
 */
export function TextFilter({
  contentProps,
  defaultOpen,
  filter,
  label,
  onOpenChange,
  open,
  rootProps,
  triggerProps,
  ...props
}: TextFilterProps): ReactElement {
  return (
    <FilterSection
      contentProps={contentProps}
      defaultOpen={defaultOpen}
      filter={filter}
      label={label}
      onOpenChange={onOpenChange}
      open={open}
      rootProps={rootProps}
      triggerProps={triggerProps}
    >
      <TextFilterControl {...props} />
    </FilterSection>
  )
}
