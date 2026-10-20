import {type ReactElement, useState} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerEventsDemo(): ReactElement {
  const [zoom, setZoom] = useState(1)

  return (
    <div className="flex w-full flex-col gap-4">
      {/* preview */}
      <ImageViewer.Root
        className="w-full"
        onZoomChange={(details) => setZoom(details.zoom)}
      >
        <ImageViewer.Viewport>
          <ImageViewer.Image
            alt="Earth at night viewed from space"
            src="/images/connected-l.png"
          />
        </ImageViewer.Viewport>
      </ImageViewer.Root>
      <output>Current zoom: {zoom.toFixed(2)}x</output>
      {/* preview */}
    </div>
  )
}
