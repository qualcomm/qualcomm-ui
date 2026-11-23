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

type BuildFilters = FilterValues<typeof filters>

function toSearchParams(value: BuildFilters): URLSearchParams {
  const params = new URLSearchParams()
  for (const status of value.status ?? []) {
    params.append("status", status)
  }
  const [architecture] = value.architecture ?? []
  if (architecture) {
    params.set("architecture", architecture)
  }
  for (const platform of value.platform ?? []) {
    params.append("platform", platform)
  }
  return params
}

export function FilterPanelUsingValueDemo(): ReactElement {
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
        <FilterPanel.Filter filter={filters.status}>
          <CheckboxGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.architecture}>
          <RadioGroupFilter />
        </FilterPanel.Filter>
        <FilterPanel.Filter filter={filters.platform}>
          <CheckboxTreeFilter defaultExpandedValue={["desktop"]} />
        </FilterPanel.Filter>
        <FilterPanel.Footer>
          <FilterPanel.ApplyButton />
        </FilterPanel.Footer>
      </FilterPanel.Root>
      {/* preview */}
      <CodeHighlight
        className="min-w-60 flex-1"
        code={`/builds?${params.toString().replaceAll("&", "\n  &")}`}
        language="text"
      />
    </div>
  )
}
