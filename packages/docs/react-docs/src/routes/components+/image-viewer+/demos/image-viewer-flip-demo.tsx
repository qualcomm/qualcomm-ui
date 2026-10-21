import {type ReactElement, useState} from "react"

import {FlipHorizontal, FlipVertical} from "lucide-react"

import {ButtonGroup, IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerFlipDemo(): ReactElement {
  const [flip, setFlip] = useState({horizontal: false, vertical: false})

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ImageViewer.Root
        alt="Scenic view of a lake in the mountains"
        className="w-full"
        flip={flip}
        onFlipChange={(details) => setFlip(details.flip)}
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
          <ButtonGroup
            aria-label="Flip controls"
            emphasis="white-persistent"
            size="sm"
          >
            <IconButton
              aria-label="Flip horizontally"
              emphasis="white-persistent"
              icon={FlipHorizontal}
              onClick={() =>
                setFlip((currentFlip) => ({
                  ...currentFlip,
                  horizontal: !currentFlip.horizontal,
                }))
              }
              variant={flip.horizontal ? "fill" : "outline"}
            />
            <IconButton
              aria-label="Flip vertically"
              icon={FlipVertical}
              onClick={() =>
                setFlip((currentFlip) => ({
                  ...currentFlip,
                  vertical: !currentFlip.vertical,
                }))
              }
              variant={flip.vertical ? "fill" : "outline"}
            />
          </ButtonGroup>
        </ImageViewer.FloatingPortal>
      </ImageViewer.Root>
    </div>
  )
}
