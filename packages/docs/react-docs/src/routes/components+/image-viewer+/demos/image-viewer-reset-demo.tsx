import type {ReactElement} from "react"

import {
  FlipHorizontal,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer, useImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerResetDemo(): ReactElement {
  const imageViewer = useImageViewer()

  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      <div className="flex flex-wrap justify-center gap-2">
        <IconButton
          aria-label="Zoom out"
          icon={ZoomOut}
          onClick={() => imageViewer.zoomBy(-0.1)}
          variant="outline"
        />
        <IconButton
          aria-label="Zoom in"
          icon={ZoomIn}
          onClick={() => imageViewer.zoomBy(0.1)}
          variant="outline"
        />
        <IconButton
          aria-label="Rotate counter-clockwise"
          icon={RotateCcw}
          onClick={() => imageViewer.rotateBy(-90)}
          variant="outline"
        />
        <IconButton
          aria-label="Rotate clockwise"
          icon={RotateCw}
          onClick={() => imageViewer.rotateBy(90)}
          variant="outline"
        />
        <IconButton
          aria-label="Flip horizontally"
          icon={FlipHorizontal}
          onClick={() => imageViewer.flipHorizontally()}
          variant="outline"
        />
        <IconButton
          aria-label="Reset image"
          icon={RefreshCw}
          onClick={() => imageViewer.reset()}
          variant="outline"
        />
      </div>
      <ImageViewer.RootProvider className="w-full" value={imageViewer}>
        <ImageViewer.Viewport>
          <ImageViewer.Image
            alt="Earth at night viewed from space"
            src="/images/connected-l.png"
          />
        </ImageViewer.Viewport>
      </ImageViewer.RootProvider>
      {/* preview */}
    </div>
  )
}
