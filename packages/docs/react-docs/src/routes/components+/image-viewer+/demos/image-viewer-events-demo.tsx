import {type ReactElement, useState} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerEventsDemo(): ReactElement {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="flex w-full flex-col gap-4">
      <ImageViewer
        alt="Scenic view of a lake in the mountains"
        className="w-full"
        onZoomChange={(details) => setZoom(details.zoom)}
        src="/images/nature-2.avif"
      />
      <output>Current zoom: {zoom.toFixed(2)}x</output>
    </div>
  )
}
