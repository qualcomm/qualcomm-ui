import type {ReactElement} from "react"

import {
  FlipHorizontal,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

import {useImageViewer} from "@qualcomm-ui/react-core/image-viewer"
import {ButtonGroup, IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerResetDemo(): ReactElement {
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
        <ButtonGroup
          aria-label="Image controls"
          emphasis="white-persistent"
          size="sm"
          variant="outline"
        >
          <IconButton
            aria-label="Zoom out"
            icon={ZoomOut}
            onClick={() => imageViewer.zoomBy(-0.1)}
          />
          <IconButton
            aria-label="Zoom in"
            icon={ZoomIn}
            onClick={() => imageViewer.zoomBy(0.1)}
          />
          <IconButton
            aria-label="Rotate counter-clockwise"
            icon={RotateCcw}
            onClick={() => imageViewer.rotateBy(-90)}
          />
          <IconButton
            aria-label="Rotate clockwise"
            icon={RotateCw}
            onClick={() => imageViewer.rotateBy(90)}
          />
          <IconButton
            aria-label="Flip horizontally"
            icon={FlipHorizontal}
            onClick={() => imageViewer.flipHorizontally()}
          />
          <IconButton
            aria-label="Reset image"
            icon={RefreshCw}
            onClick={() => imageViewer.reset()}
          />
        </ButtonGroup>
      </ImageViewer.FloatingPortal>
    </ImageViewer.RootProvider>
  )
}
