import {type ReactElement, useState} from "react"

import {
  defineFilters,
  type FilterValues,
  listFilter,
  treeFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxGroupFilter,
  CheckboxTreeFilter,
  RadioGroupFilter,
} from "@qualcomm-ui/react/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

interface PlatformNode {
  id: string
  nodes?: PlatformNode[]
  text: string
}

const platforms = createTreeCollection<PlatformNode>({
  nodeText: "text",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        id: "desktop",
        nodes: [
          {id: "linux", text: "Linux"},
          {id: "macos", text: "macOS"},
          {id: "windows", text: "Windows"},
        ],
        text: "Desktop",
      },
      {
        id: "mobile",
        nodes: [
          {id: "android", text: "Android"},
          {id: "ios", text: "iOS"},
        ],
        text: "Mobile",
      },
    ],
    text: "",
  },
})

const filters = defineFilters({
  architecture: listFilter({
    collection: new ListCollection({items: ["arm64", "x86-64"]}),
    label: "Architecture",
  }),
  platform: treeFilter({collection: platforms, label: "Platform"}),
  status: listFilter({
    collection: new ListCollection({items: ["Failed", "Passed", "Queued"]}),
    label: "Status",
  }),
})

export function FilterPanelBasicDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <FilterPanel.Header>
          <FilterPanel.Heading>
            Filters <FilterPanel.Count />
          </FilterPanel.Heading>
          <FilterPanel.ClearButton />
        </FilterPanel.Header>
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.architecture}>
          <RadioGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.platform}>
          <CheckboxTreeFilter defaultExpandedValue={["desktop"]} />
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
