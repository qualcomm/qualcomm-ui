import {type ReactElement, useState} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerControlledZoomDemo(): ReactElement {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ImageViewer
        alt="Scenic view of a lake in the mountains"
        className="w-full"
        onZoomChange={(details) => setZoom(details.zoom)}
        src="/images/nature-2.avif"
        zoom={zoom}
      />
      <output>{zoom.toFixed(1)}x</output>
    </div>
  )
}
