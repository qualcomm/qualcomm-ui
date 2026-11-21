import {type ReactElement, useState} from "react"

import {
  customFilter,
  defineFilters,
  type FilterValues,
} from "@qualcomm-ui/core/filters"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {useFilter} from "@qualcomm-ui/react/filters"
import {Switch} from "@qualcomm-ui/react/switch"

const filters = defineFilters({
  attachments: customFilter<boolean>({
    getValueItems: () => [{label: "Has attachments", value: "true"}],
    isEmptyValue: (value) => !value,
    label: "Attachments",
  }),
})

function AttachmentsControl(): ReactElement {
  const filter = useFilter<typeof filters.attachments>()
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
          <AttachmentsControl />
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
