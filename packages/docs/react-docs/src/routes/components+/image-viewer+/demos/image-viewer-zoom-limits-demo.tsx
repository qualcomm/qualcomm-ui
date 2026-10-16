import {type ReactElement, useState} from "react"

import {ZoomIn, ZoomOut} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

const minZoom = 0.5
const maxZoom = 2

export function ImageViewerZoomLimitsDemo(): ReactElement {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* preview */}
      <ImageViewer.Root
        className="w-full"
        maxZoom={maxZoom}
        minZoom={minZoom}
        onZoomChange={(details) => setZoom(details.zoom)}
        zoom={zoom}
      >
        <ImageViewer.Viewport>
          <ImageViewer.Image
            alt="Earth at night viewed from space"
            src="/images/connected-l.png"
          />
        </ImageViewer.Viewport>
      </ImageViewer.Root>
      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Zoom out"
          icon={ZoomOut}
          onClick={() =>
            setZoom((currentZoom) => Math.max(minZoom, currentZoom - 0.1))
          }
          variant="outline"
        />
        <output>{zoom.toFixed(1)}x</output>
        <IconButton
          aria-label="Zoom in"
          icon={ZoomIn}
          onClick={() =>
            setZoom((currentZoom) => Math.min(maxZoom, currentZoom + 0.1))
          }
          variant="outline"
        />
      </div>
      <p className="text-body-sm text-neutral-secondary">
        Zoom is limited to {minZoom}x through {maxZoom}x.
      </p>
      {/* preview */}
    </div>
  )
}
