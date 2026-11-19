// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ComponentProps, type ReactElement, useMemo} from "react"

import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {selectCollection} from "@qualcomm-ui/core/select"
import {useFilterSetContext} from "@qualcomm-ui/react-core/filter-set"
import {ProgressRing} from "@qualcomm-ui/react/progress-ring"
import {Select} from "@qualcomm-ui/react/select"

import {
  defaultLoadErrorText,
  type FilterCollectionStatusTextProps,
  isInitialLoad,
} from "./internal/filter-collection-status.js"
import {
  getFilterLabelProps,
  useFilterWidget,
} from "./internal/use-filter-widget.js"
import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface SelectFilterProps
  extends
    Omit<
      ComponentProps<typeof Select>,
      "collection" | "defaultValue" | "onValueChange" | "value"
    >,
    Omit<FilterCollectionStatusTextProps, "loadingText" | "retryLabel"> {}

/**
 * A select listing the items of the filter's list collection. Supports
 * `multiple`. Writes a `string[]`. Shows a spinner while the collection loads
 * for the first time, and an error when it fails to load.
 */
export function SelectFilter({
  controlProps,
  loadErrorText = defaultLoadErrorText,
  ...props
}: SelectFilterProps): ReactElement {
  const filter = useFilterWidget<ListFilterDefinition>("SelectFilter", "list")
  const api = useFilterSetContext()
  const qdsContext = useQdsFilterControlContext()
  const options = api.getFilterOptions(filter.id)
  const collection = useMemo(
    () => selectCollection({items: options}),
    [options],
  )
  const labelProps = getFilterLabelProps(filter)
  const status = filter.collectionState?.status

  return (
    <Select
      {...labelProps}
      collection={collection}
      controlProps={{...labelProps, ...controlProps}}
      onValueChange={(value) => filter.setValue(value)}
      size={qdsContext.size}
      value={filter.value ?? []}
      {...props}
      errorText={status === "error" ? loadErrorText : props.errorText}
      icon={
        isInitialLoad(filter.collectionState) ? (
          <ProgressRing aria-hidden size="xs" />
        ) : (
          props.icon
        )
      }
      invalid={status === "error" || props.invalid}
    />
  )
}
