import {type ReactElement, useState} from "react"

import {RotateCcw, RotateCw} from "lucide-react"

import {ButtonGroup, IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerRotationDemo(): ReactElement {
  const [rotation, setRotation] = useState(0)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <ImageViewer.Root
        alt="Scenic view of a lake in the mountains"
        className="w-full"
        onRotationChange={(details) => setRotation(details.rotation)}
        rotation={rotation}
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
          <div className="flex items-center gap-2">
            <ButtonGroup
              aria-label="Rotation controls"
              emphasis="white-persistent"
              size="sm"
              variant="outline"
            >
              <IconButton
                aria-label="Rotate counter-clockwise"
                icon={RotateCcw}
                onClick={() =>
                  setRotation((currentRotation) => currentRotation - 90)
                }
              />
              <IconButton
                aria-label="Rotate clockwise"
                icon={RotateCw}
                onClick={() =>
                  setRotation((currentRotation) => currentRotation + 90)
                }
              />
            </ButtonGroup>
            <output>{rotation}°</output>
          </div>
        </ImageViewer.FloatingPortal>
      </ImageViewer.Root>
    </div>
  )
}
