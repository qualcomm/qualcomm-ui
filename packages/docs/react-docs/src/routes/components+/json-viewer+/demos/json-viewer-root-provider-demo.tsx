import {type ReactElement, useState} from "react"

import {ChevronRight} from "lucide-react"

import {Button} from "@qualcomm-ui/react/button"
import {JsonViewer, useJsonViewer} from "@qualcomm-ui/react/json-viewer"

const data = {
  founded: 1985,
  name: "Qualcomm",
  products: {
    chips: ["Snapdragon 8 Gen 3", "Snapdragon 7+ Gen 2"],
    modems: ["X75", "X72"],
  },
  public: true,
}

export function JsonViewerRootProviderDemo(): ReactElement {
  const viewer = useJsonViewer({data, defaultExpandedDepth: 1})
  const [expanded, setExpanded] = useState<string[]>(
    viewer.defaultExpandedValue ?? [],
  )

  const handleExpandAll = () => setExpanded(viewer.collection.getBranchValues())
  const handleCollapseAll = () => setExpanded([])

  return (
    <div className="w-full">
      <div className="mb-2 flex gap-2">
        <Button onClick={handleExpandAll}>Expand all</Button>
        <Button onClick={handleCollapseAll}>Collapse all</Button>
      </div>
      {/* preview */}
      <JsonViewer.RootProvider
        expandedValue={expanded}
        onExpandedValueChange={({expandedValue}) => setExpanded(expandedValue)}
        value={viewer}
      >
        <JsonViewer.Tree arrow={ChevronRight} indentGuide />
      </JsonViewer.RootProvider>
      {/* preview */}
      <output className="font-body-sm text-neutral-primary mt-2 block">
        {expanded.length} of {viewer.collection.getBranchValues().length}{" "}
        branches expanded
      </output>
    </div>
  )
}
