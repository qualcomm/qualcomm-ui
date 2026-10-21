import type {ReactElement} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerSimpleDemo(): ReactElement {
  return (
    // preview
    <ImageViewer
      alt="Scenic view of a lake in the mountains"
      src="/images/nature-2.avif"
    />
    // preview
  )
}
