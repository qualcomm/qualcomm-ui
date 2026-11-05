import type {ReactElement} from "react"

import {ButtonGroup} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerCompositeDemo(): ReactElement {
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
        <ButtonGroup aria-label="Image controls" size="sm">
          <ImageViewer.ZoomOutButton />
          <ImageViewer.ZoomInButton />
          <ImageViewer.ResetButton />
        </ButtonGroup>
      </ImageViewer.FloatingPortal>
    </ImageViewer.Root>
  )
}
