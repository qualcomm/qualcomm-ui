import {type ReactElement, useState} from "react"

import {
  defineFilters,
  type FilterValues,
  treeFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {CheckboxTreeFilter} from "@qualcomm-ui/react/filters"

interface ChipsetNode {
  id: string
  nodes?: ChipsetNode[]
  text: string
}

const chipsets = createTreeCollection<ChipsetNode>({
  nodeText: "text",
  nodeValue: "id",
  rootNode: {
    id: "ROOT",
    nodes: [
      {
        id: "snapdragon-x",
        nodes: [
          {id: "x1e-84-100", text: "X1E-84-100"},
          {id: "x1e-80-100", text: "X1E-80-100"},
          {id: "x1p-64-100", text: "X1P-64-100"},
        ],
        text: "Snapdragon X",
      },
      {
        id: "snapdragon-8",
        nodes: [
          {id: "sm8750", text: "SM8750"},
          {id: "sm8650", text: "SM8650"},
        ],
        text: "Snapdragon 8",
      },
    ],
    text: "",
  },
})

const filters = defineFilters({
  chipset: treeFilter({collection: chipsets, label: "Chipset"}),
})

export function CheckboxTreeFilterDemo(): ReactElement {
  const [value, setValue] = useState<FilterValues<typeof filters>>({})

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        className="w-72"
        filters={filters}
        onValueChange={setValue}
      >
        <FilterPanel.Filter filter={filters.chipset}>
          <CheckboxTreeFilter defaultExpandedValue={["snapdragon-x"]} />
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
