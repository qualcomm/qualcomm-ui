import {type ReactElement, useState} from "react"

import {
  checkboxFilter,
  checkboxTreeFilter,
  defineFilters,
  type FilterValues,
  radioFilter,
} from "@qualcomm-ui/core/filters"
import {createTreeCollection} from "@qualcomm-ui/core/tree"
import {CodeHighlight} from "@qualcomm-ui/react-mdx/code-highlight"
import {FilterPanel} from "@qualcomm-ui/react/filter-panel"
import {
  CheckboxFilter,
  CheckboxTreeFilter,
  RadioFilter,
} from "@qualcomm-ui/react/filters"

const filters = defineFilters({
  chipset: checkboxTreeFilter({label: "Chipset"}),
  mode: radioFilter({
    label: "Build mode",
    options: [
      {label: "Debug", value: "debug"},
      {label: "Test", value: "test"},
      {label: "Release", value: "release"},
    ],
  }),
  status: checkboxFilter({
    label: "Status",
    options: ["Failed", "Passed", "Queued"],
  }),
})

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
        id: "snapdragon_x_elite",
        nodes: [
          {id: "X1E-00-1DE", text: "12-core X1E-00-1DE"},
          {id: "X1E-84-100", text: "12-core X1E-84-100"},
          {id: "X1E-80-100", text: "12-core X1E-80-100"},
          {id: "X1E-78-100", text: "12-core X1E-78-100"},
        ],
        text: "Snapdragon X Elite",
      },
      {
        id: "snapdragon_x_plus",
        nodes: [
          {id: "X1P-66-100", text: "10-core X1P-66-100"},
          {id: "X1P-64-100", text: "10-core X1P-64-100"},
          {id: "X1P-46-100", text: "8-core X1P-46-100"},
          {id: "X1P-42-100", text: "8-core X1P-42-100"},
        ],
        text: "Snapdragon X Plus",
      },
    ],
    text: "",
  },
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
        <CheckboxFilter filter={filters.status} />
        <RadioFilter filter={filters.mode} />
        <CheckboxTreeFilter
          collection={chipsets}
          defaultExpandedValue={["snapdragon_x_elite"]}
          filter={filters.chipset}
        />
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
