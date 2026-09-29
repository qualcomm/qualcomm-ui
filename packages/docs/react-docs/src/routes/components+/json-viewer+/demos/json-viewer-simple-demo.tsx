import type {ReactElement} from "react"

import {JsonViewer} from "@qualcomm-ui/react/json-viewer"

const data = {
  dependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    typescript: "^5.7.0",
  },
  engines: {
    node: ">=20",
  },
  name: "Qualcomm UI",
  private: true,
  scripts: {
    build: "turbo build",
    dev: "turbo dev",
    lint: "turbo lint",
  },
  version: "1.0.0",
}

export function JsonViewerSimpleDemo(): ReactElement {
  return (
    // preview
    <JsonViewer
      collapseStringsAfterLength={50}
      data={data}
      defaultExpandedDepth={0}
      maxPreviewItems={7}
      quotesOnKeys
    />
    // preview
  )
}
