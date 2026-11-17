import {type ReactElement, useState} from "react"

import type {FilterValues} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxFilter,
  RangeFilter,
  TextFilter,
} from "@qualcomm-ui/react/filters"

import {filters} from "./filters"

type BuildFilters = FilterValues<typeof filters>

function toSearchParams(value: BuildFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const status of value.status ?? []) {
    params.append("status", status)
  }
  const [minDuration, maxDuration] = value.duration ?? [null, null]
  if (minDuration !== null) {
    params.set("minDuration", String(minDuration))
  }
  if (maxDuration !== null) {
    params.set("maxDuration", String(maxDuration))
  }
  if (value.buildPath) {
    params.set("path", value.buildPath)
  }
  return params
}

export function FilterPanelSearchParamsDemo(): ReactElement {
  const [params, setParams] = useState(new URLSearchParams())

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={(value) => setParams(toSearchParams(value))}
      >
        <CheckboxFilter filter={filters.status} />
        <RangeFilter filter={filters.duration} />
        <TextFilter filter={filters.buildPath} />
        <FilterPanel.Footer>
          <FilterPanel.ApplyTrigger />
        </FilterPanel.Footer>
      </FilterPanel.Root>
      {/* preview */}
      <CodeHighlight
        className="min-w-60 flex-1"
        code={`/builds?${params.toString()}`}
        language="text"
      />
    </div>
  )
}
