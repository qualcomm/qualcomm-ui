import {type ReactElement, useState} from "react"

import type {FilterValues} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {
  FilterPanel,
  useFilterPanelFilter,
} from "@qualcomm-ui/react/filter-panel"
import {Switch} from "@qualcomm-ui/react/switch"

import {filters} from "./filters"

function AttachmentsControl(): ReactElement {
  const filter = useFilterPanelFilter<typeof filters.attachments>()
  return (
    <Switch
      checked={filter.value ?? false}
      label="Has attachments"
      onCheckedChange={(checked) => filter.setValue(checked)}
    />
  )
}

export function FilterPanelCustomFilterDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <FilterPanel.Filter filter={filters.attachments}>
          <FilterPanel.FilterTrigger />
          <FilterPanel.FilterContent>
            <AttachmentsControl />
          </FilterPanel.FilterContent>
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
