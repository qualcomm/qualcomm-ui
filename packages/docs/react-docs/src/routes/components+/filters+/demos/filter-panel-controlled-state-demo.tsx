import {type ReactElement, useState} from "react"

import type {FilterSetOptionLabels} from "@qualcomm-ui/core/filter-set"
import {
  defineFilters,
  type FilterValues,
  optionFilter,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter, ComboboxFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  owner: optionFilter({label: "Owner"}),
  status: optionFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
})

const owners = [
  {label: "Anna Robinson", value: "u1"},
  {label: "Ben Ortiz", value: "u2"},
  {label: "Chloe Nguyen", value: "u3"},
  {label: "Dev Patel", value: "u4"},
]

export function FilterPanelControlledStateDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({
    status: ["Failed"],
  })
  const [labels, setLabels] = useState<FilterSetOptionLabels>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={(nextValue, details) => {
          setValue(nextValue)
          setLabels(details.labels)
        }}
        value={value}
      >
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.owner}>
          <ComboboxFilter options={owners} />
        </FilterPanel.Filter>
      </FilterPanel.Root>
      {/* preview */}
      <CodeHighlight
        className="min-w-60 flex-1"
        code={JSON.stringify({labels, value}, null, 2)}
        language="json"
      />
    </div>
  )
}
