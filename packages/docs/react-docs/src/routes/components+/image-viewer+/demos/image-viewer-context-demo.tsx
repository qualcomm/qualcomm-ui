import type {ReactElement} from "react"

import {ZoomIn, ZoomOut} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerContextDemo(): ReactElement {
  return (
    <ImageViewer.Root className="w-full">
      {/* preview */}
      <ImageViewer.Context>
        {(context) => (
          <div className="flex items-center justify-center gap-2">
            <IconButton
              aria-label="Zoom out"
              icon={ZoomOut}
              onClick={() => context.zoomBy(-0.1)}
              variant="outline"
            />
            <output>{context.zoom.toFixed(1)}x</output>
            <IconButton
              aria-label="Zoom in"
              icon={ZoomIn}
              onClick={() => context.zoomBy(0.1)}
              variant="outline"
            />
          </div>
        )}
      </ImageViewer.Context>
      <ImageViewer.Viewport>
        <ImageViewer.Image
          alt="Earth at night viewed from space"
          src="/images/connected-l.png"
        />
      </ImageViewer.Viewport>
      {/* preview */}
    </ImageViewer.Root>
  )
}
