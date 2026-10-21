import type {ReactElement} from "react"

import {ZoomIn, ZoomOut} from "lucide-react"

import {ButtonGroup, IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerContextDemo(): ReactElement {
  return (
    <ImageViewer.Root
      alt="Scenic view of a lake in the mountains"
      className="w-full"
      src="/images/nature-2.avif"
    >
      <ImageViewer.Trigger className="block w-full">
        <ImageViewer.StaticImage className="mx-auto block max-w-full" />
      </ImageViewer.Trigger>
      <ImageViewer.FloatingPortal>
        <ImageViewer.CloseButton />
        <ImageViewer.Viewport>
          <ImageViewer.ViewportImage />
        </ImageViewer.Viewport>
        <ImageViewer.Context>
          {(context) => (
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
                  onClick={() => context.zoomBy(-0.1)}
                />
                <IconButton
                  aria-label="Zoom in"
                  icon={ZoomIn}
                  onClick={() => context.zoomBy(0.1)}
                />
              </ButtonGroup>
              <output>{context.zoom.toFixed(1)}x</output>
            </div>
          )}
        </ImageViewer.Context>
      </ImageViewer.FloatingPortal>
    </ImageViewer.Root>
  )
}
