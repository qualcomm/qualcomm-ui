import type {ReactElement} from "react"

import {ZoomIn, ZoomOut} from "lucide-react"

import {useImageViewer} from "@qualcomm-ui/react-core/image-viewer"
import {IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerRootProviderDemo(): ReactElement {
  const imageViewer = useImageViewer()

  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      <div className="flex items-center justify-center gap-2">
        <IconButton
          aria-label="Zoom out"
          icon={ZoomOut}
          onClick={() => imageViewer.setZoom(imageViewer.zoom - 0.1)}
          variant="outline"
        />
        <output>{imageViewer.zoom.toFixed(1)}x</output>
        <IconButton
          aria-label="Zoom in"
          icon={ZoomIn}
          onClick={() => imageViewer.setZoom(imageViewer.zoom + 0.1)}
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
