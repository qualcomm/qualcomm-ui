import {type ReactElement, useState} from "react"

import {
  defineFilters,
  type FilterValues,
  optionFilter,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {RadioGroupFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  mode: optionFilter({
    label: "Build mode",
    options: [
      {label: "Any", value: ""},
      {label: "Debug", value: "debug"},
      {label: "Release", value: "release"},
    ],
  }),
})

export function RadioGroupFilterDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <FilterPanel.Filter filter={filters.mode}>
          <RadioGroupFilter />
        </FilterPanel.Filter>
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
