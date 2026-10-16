import type {ReactElement} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerSimpleDemo(): ReactElement {
  return (
    <>
      {/* preview */}
      <ImageViewer
        alt="Earth at night viewed from space"
        className="w-full"
        src="/images/connected-l.png"
      />
      {/* preview */}
    </>
  )
}
