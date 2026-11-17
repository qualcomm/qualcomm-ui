import {type ReactElement, useState} from "react"

import type {FilterPanelOptionLabels} from "@qualcomm-ui/core/filter-panel"
import type {FilterValues} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxFilter, ComboboxFilter} from "@qualcomm-ui/react/filters"

import {filters, owners} from "./filters"

export function FilterPanelControlledStateDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({
    status: ["Failed"],
  })
  const [labels, setLabels] = useState<FilterPanelOptionLabels>({})

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
        <CheckboxFilter filter={filters.status} />
        <ComboboxFilter filter={filters.owner} options={owners} />
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
