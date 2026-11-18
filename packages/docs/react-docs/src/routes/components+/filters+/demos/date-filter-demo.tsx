import {type ReactElement, useState} from "react"

import {
  dateFilter,
  defineFilters,
  type FilterValues,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {DateFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  submitted: dateFilter({
    label: "Submitted",
    presets: [
      {label: "Last 7 days", value: "last7Days"},
      {label: "This month", value: "thisMonth"},
      {
        label: "Since release",
        range: () => ["2026-09-01", null],
        value: "sinceRelease",
      },
    ],
  }),
})

export function DateFilterDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <DateFilter filter={filters.submitted} />
      </FilterPanel.Root>
      {/* preview */}
      <CodeHighlight
        className="min-w-60 flex-1"
        code={JSON.stringify(value, null, 2)}
        language="json"
      />
    </div>
  )
}
