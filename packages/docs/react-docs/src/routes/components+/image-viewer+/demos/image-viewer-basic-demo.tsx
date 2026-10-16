import type {ReactElement} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerBasicDemo(): ReactElement {
  return (
    <ImageViewer.Root className="w-full">
      {/* preview */}
      <ImageViewer.Viewport>
        <ImageViewer.Image
          alt="Earth at night viewed from space"
          src="/images/connected-l.png"
        />
      </ImageViewer.Viewport>
      <div className="flex justify-center gap-2">
        <ImageViewer.ZoomOutButton />
        <ImageViewer.ZoomInButton />
        <ImageViewer.ResetButton />
      </div>
      {/* preview */}
    </ImageViewer.Root>
  )
}
