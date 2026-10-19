import type {ReactElement} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerExplorerDemo(): ReactElement {
  return (
    <ImageViewer.Root className="w-full">
      <ImageViewer.Viewport>
        <ImageViewer.Image
          alt="Earth at night viewed from space"
          src="/images/connected-l.png"
        />
        <ImageViewer.ControlOverlay className="visible!">
          <ImageViewer.ZoomInButton />
          <ImageViewer.ZoomOutButton />
          <ImageViewer.ResetButton />
        </ImageViewer.ControlOverlay>
      </ImageViewer.Viewport>
    </ImageViewer.Root>
  )
}
