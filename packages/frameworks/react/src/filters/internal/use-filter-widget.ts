// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect} from "react"

import type {FilterDefinition} from "@qualcomm-ui/core/filters"
import {
  type FilterContextValue,
  useFilter,
} from "@qualcomm-ui/react-core/filter-set"
import {warn} from "@qualcomm-ui/utils/warning"

/**
 * Returns the surrounding filter's state for a widget. Warns in development
 * when the filter's definition is a kind the widget can't write. Custom
 * filters are always accepted.
 */
export function useFilterWidget<TDef extends FilterDefinition>(
  widget: string,
  kind: TDef["kind"],
): FilterContextValue<TDef> {
  const filter = useFilter<TDef>()
  const actualKind = filter.definition.kind

  useEffect(() => {
    warn(
      actualKind !== kind && actualKind !== "custom",
      `${widget} writes "${kind}" filters, but filter "${filter.id}" is a "${actualKind}" filter.`,
    )
  }, [actualKind, filter.id, kind, widget])

  return filter
}

/**
 * Names a control by the filter's label element when there is one, otherwise
 * by the filter's label text.
 */
export function getFilterLabelProps(
  filter: Pick<FilterContextValue, "label" | "labelId">,
): {"aria-label"?: string; "aria-labelledby"?: string} {
  return filter.labelId
    ? {"aria-labelledby": filter.labelId}
    : {"aria-label": filter.label}
}
