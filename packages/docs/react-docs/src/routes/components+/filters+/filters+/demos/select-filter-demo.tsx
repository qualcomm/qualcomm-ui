import {type ReactElement, useState} from "react"

import {
  defineFilters,
  type FilterValues,
  selectFilter,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {SelectFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  standard: selectFilter({
    label: "Standard",
    options: [
      {label: "Wi-Fi 6", value: "wifi6"},
      {label: "Wi-Fi 6E", value: "wifi6e"},
      {label: "Wi-Fi 7", value: "wifi7"},
    ],
  }),
})

export function SelectFilterDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <SelectFilter filter={filters.standard} />
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
