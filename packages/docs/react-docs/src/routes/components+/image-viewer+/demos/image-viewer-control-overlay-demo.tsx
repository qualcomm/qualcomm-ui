import type {ReactElement} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerControlOverlayDemo(): ReactElement {
  return (
    <ImageViewer.Root className="w-full">
      {/* preview */}
      <ImageViewer.Viewport>
        <ImageViewer.Image
          alt="Earth at night viewed from space"
          src="/images/connected-l.png"
        />
        <ImageViewer.ControlOverlay>
          <ImageViewer.ZoomInButton />
          <ImageViewer.ZoomOutButton />
          <ImageViewer.ResetButton />
        </ImageViewer.ControlOverlay>
      </ImageViewer.Viewport>
      {/* preview */}
    </ImageViewer.Root>
  )
}
