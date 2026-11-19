import {type ReactElement, useState} from "react"

import {
  defineFilters,
  type FilterValues,
  optionFilter,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {Button} from "@qualcomm-ui/react/button"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxGroupFilter, RadioGroupFilter} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  mode: optionFilter({
    label: "Build mode",
    options: [
      {label: "Debug", value: "debug"},
      {label: "Test", value: "test"},
      {label: "Release", value: "release"},
    ],
  }),
  status: optionFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
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
        <FilterPanel.Filter filter={filters.mode}>
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
