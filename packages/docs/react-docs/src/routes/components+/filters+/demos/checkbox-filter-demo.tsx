import {type ReactElement, useState} from "react"

import {
  checkboxFilter,
  defineFilters,
  type FilterValues,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  status: checkboxFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
})

export function CheckboxFilterDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <CheckboxFilter filter={filters.status} />
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
