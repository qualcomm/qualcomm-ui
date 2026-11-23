// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps, ReactElement} from "react"

import {createSelectFilterApi} from "@qualcomm-ui/core/filter-control"
import type {ListFilterDefinition} from "@qualcomm-ui/core/filters"
import {useFilter} from "@qualcomm-ui/react-core/filter-set"
import {Select} from "@qualcomm-ui/react/select"

import {useQdsFilterControlContext} from "./qds-filter-control-context.js"

export interface SelectFilterProps extends Omit<
  ComponentProps<typeof Select>,
  "collection" | "defaultValue" | "onValueChange" | "value"
> {}

/**
 * A select listing the items of the filter's list collection. Supports
 * `multiple`. Writes a `string[]`.
 */
export function SelectFilter({
  controlProps,
  ...props
}: SelectFilterProps): ReactElement {
  const api = createSelectFilterApi(useFilter<ListFilterDefinition>())
  const qdsContext = useQdsFilterControlContext()
  const labelProps = api.getLabelProps()

  return (
    <Select
      {...labelProps}
      collection={api.collection}
      controlProps={{...labelProps, ...controlProps}}
      onValueChange={api.setValue}
      size={qdsContext.size}
      value={api.value}
      {...props}
    />
  )
}
