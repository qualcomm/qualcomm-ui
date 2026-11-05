import {type ReactElement, useState} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

const minZoom = 0.5
const maxZoom = 2

export function ImageViewerZoomLimitsDemo(): ReactElement {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ImageViewer
        alt="Scenic view of a lake in the mountains"
        className="w-full"
        maxZoom={maxZoom}
        minZoom={minZoom}
        onZoomChange={(details) => setZoom(details.zoom)}
        src="/images/nature-2.avif"
        zoom={zoom}
      />
      <output>{zoom.toFixed(1)}x</output>
      <p className="text-body-sm text-neutral-secondary">
        Zoom is limited to {minZoom}x through {maxZoom}x.
      </p>
    </div>
  )
}
