import type {ReactElement} from "react"

import {ChevronRight} from "lucide-react"

import {JsonViewer} from "@qualcomm-ui/react/json-viewer"

const data = {
  settings: {
    notifications: {
      email: true,
      push: false,
    },
    theme: "dark",
  },
  users: [
    {id: 1, name: "Alice", roles: ["admin", "editor"]},
    {id: 2, name: "Bob", roles: ["viewer"]},
  ],
}

export function JsonViewerCompositeDemo(): ReactElement {
  return (
    // preview
    <JsonViewer.Root data={data} defaultExpandedDepth={3}>
      <JsonViewer.Tree arrow={ChevronRight} indentGuide />
    </JsonViewer.Root>
    // preview
  )
}
