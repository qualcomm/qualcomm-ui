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

type BuildFilters = FilterValues<typeof filters>

function toSearchParams(value: BuildFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const status of value.status ?? []) {
    params.append("status", status)
  }
  const [mode] = value.mode ?? []
  if (mode) {
    params.set("mode", mode)
  }
  for (const chipset of value.chipset ?? []) {
    params.append("chipset", chipset)
  }
  return params
}

export function FilterPanelSearchParamsDemo(): ReactElement {
  const [params, setParams] = useState(new URLSearchParams())

  return (
    <div className="flex w-full max-w-3xl flex-wrap items-start gap-6">
      {/* preview */}
      <FilterPanel.Root
        applyMode="manual"
        className="w-72"
        filters={filters}
        onValueChange={(value) => setParams(toSearchParams(value))}
      >
        <CheckboxFilter filter={filters.status} />
        <RadioFilter filter={filters.mode} />
        <CheckboxTreeFilter
          collection={chipsets}
          defaultExpandedValue={["snapdragon_x_elite"]}
          filter={filters.chipset}
        />
        <FilterPanel.Footer>
          <FilterPanel.ApplyButton />
        </FilterPanel.Footer>
      </FilterPanel.Root>
      {/* preview */}
      <CodeHighlight
        className="min-w-60 flex-1"
        code={`/builds?${params.toString()}`}
        language="text"
      />
    </div>
  )
}
