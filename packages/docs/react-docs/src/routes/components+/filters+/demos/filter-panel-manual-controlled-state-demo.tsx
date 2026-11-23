import {type ReactElement, useState} from "react"

import {
  defineFilters,
  type FilterValues,
  listFilter,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Button} from "@qualcomm-ui/react/button"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter, RadioGroupFilter} from "@qualcomm-ui/react/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

const filters = defineFilters({
  architecture: listFilter({
    collection: new ListCollection({items: ["arm64", "x86-64"]}),
    label: "Architecture",
  }),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

export function FilterPanelManualControlledStateDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({
    status: ["Failed"],
  })

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        applyMode="manual"
        className="w-72"
        filters={filters}
        onValueChange={setValue}
        value={value}
      >
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.architecture}>
          <RadioGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Footer>
          <FilterPanel.ApplyButton />
        </FilterPanel.Footer>
      </FilterPanel.Root>
      {/* preview */}
      <div className="flex min-w-60 flex-1 flex-col items-start gap-4">
        <Button onClick={() => setValue({})} size="sm" variant="outline">
          Reset value
        </Button>
        <CodeHighlight
          className="w-full"
          code={JSON.stringify(value, null, 2)}
          language="json"
        />
      </div>
    </div>
  )
}
