import type {ReactElement} from "react"

import {ZoomIn, ZoomOut} from "lucide-react"

import {useImageViewer} from "@qualcomm-ui/react-core/image-viewer"
import {ButtonGroup, IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerRootProviderDemo(): ReactElement {
  const imageViewer = useImageViewer()

  return (
    <ImageViewer.RootProvider
      alt="Scenic view of a lake in the mountains"
      className="w-full"
      src="/images/nature-2.avif"
      value={imageViewer}
    >
      <ImageViewer.Trigger className="block w-full">
        <ImageViewer.StaticImage className="mx-auto block max-w-full" />
      </ImageViewer.Trigger>
      <ImageViewer.FloatingPortal>
        <ImageViewer.CloseButton />
        <ImageViewer.Viewport>
          <ImageViewer.ViewportImage />
        </ImageViewer.Viewport>
        <div className="flex items-center justify-center gap-2">
          <ButtonGroup
            aria-label="Zoom controls"
            emphasis="white-persistent"
            size="sm"
            variant="outline"
          >
            <IconButton
              aria-label="Zoom out"
              icon={ZoomOut}
              onClick={() => imageViewer.setZoom(imageViewer.zoom - 0.1)}
            />
            <IconButton
              aria-label="Zoom in"
              icon={ZoomIn}
              onClick={() => imageViewer.setZoom(imageViewer.zoom + 0.1)}
            />
          </ButtonGroup>
          <output>{imageViewer.zoom.toFixed(1)}x</output>
        </div>
      </ImageViewer.FloatingPortal>
    </ImageViewer.RootProvider>
  )
}
