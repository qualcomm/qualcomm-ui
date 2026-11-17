import {type ReactElement, useState} from "react"

import type {FilterValues} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxFilter,
  CheckboxTreeFilter,
  RadioFilter,
} from "@qualcomm-ui/react/filters"

import {chipsets, filters} from "./filters"

type BuildFilters = FilterValues<typeof filters>

function toSearchParams(value: BuildFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const status of value.status ?? []) {
    params.append("status", status)
  }
  const [mode] = value.mode ?? []
  if (mode) {
    params.set("mode", mode)
  }
  for (const chipset of value.chipset ?? []) {
    params.append("chipset", chipset)
  }
  return params
}

export function FilterPanelSearchParamsDemo(): ReactElement {
  const [params, setParams] = useState(new URLSearchParams())

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        applyMode="manual"
        className="w-72"
        filters={filters}
        onValueChange={(value) => setParams(toSearchParams(value))}
      >
        <CheckboxFilter filter={filters.status} />
        <RadioFilter filter={filters.mode} />
        <CheckboxTreeFilter
          collection={chipsets}
          defaultExpandedValue={["snapdragon_x_elite"]}
          filter={filters.chipset}
        />
        <FilterPanel.Footer>
          <FilterPanel.ApplyButton />
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
