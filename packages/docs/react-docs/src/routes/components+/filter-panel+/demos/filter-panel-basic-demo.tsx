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

export function FilterPanelBasicDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <FilterPanel.Header>
          <FilterPanel.Heading>
            Filters <FilterPanel.Count />
          </FilterPanel.Heading>
          <FilterPanel.ClearTrigger />
        </FilterPanel.Header>
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
        code={`// filter value\n${JSON.stringify(value, null, 2)}`}
        language="json"
      />
    </div>
  )
}
