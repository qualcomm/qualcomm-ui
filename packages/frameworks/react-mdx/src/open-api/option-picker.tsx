// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactNode, useMemo, useState} from "react"

import {selectCollection} from "@qualcomm-ui/core/select"
import {Select} from "@qualcomm-ui/react/select"

export interface PickedOption {
  index: number
  label: string | undefined
  setLabel: (label: string) => void
}

/**
 * The picked option, by label. `labels` must be memoized: without `remember`,
 * a new array means new options, and the pick goes back to the first one. With
 * `remember`, the label is kept as long as the new options include it, e.g. a
 * code sample language across operations.
 */
export function usePickedOption(
  labels: string[],
  {remember = false}: {remember?: boolean} = {},
): PickedOption {
  const [picked, setPicked] = useState<{
    label: string | undefined
    labels: string[]
  }>({label: undefined, labels})
  const label = remember || picked.labels === labels ? picked.label : undefined
  const index = label === undefined ? 0 : Math.max(labels.indexOf(label), 0)
  return {
    index,
    label: labels[index],
    setLabel: (label) => setPicked({label, labels}),
  }
}

export interface OptionPickerProps {
  "aria-label"?: string
  "aria-labelledby"?: string
  /**
   * Unique, since they double as values.
   */
  labels: string[]
  picked: PickedOption
}

/**
 * A compact Select over a handful of options, e.g. code sample languages.
 */
export function OptionPicker({
  labels,
  picked,
  ...controlProps
}: OptionPickerProps): ReactNode {
  const collection = useMemo(
    () =>
      selectCollection({items: labels.map((label) => ({label, value: label}))}),
    [labels],
  )
  return (
    <Select
      clearable={false}
      collection={collection}
      controlProps={controlProps}
      onValueChange={(next) => next.length && picked.setLabel(next[0])}
      positioning={{sameWidth: false}}
      size="sm"
      value={picked.label === undefined ? [] : [picked.label]}
    />
  )
}
