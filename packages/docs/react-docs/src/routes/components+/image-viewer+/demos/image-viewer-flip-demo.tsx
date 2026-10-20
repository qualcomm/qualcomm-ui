import {type ReactElement, useState} from "react"

import {FlipHorizontal, FlipVertical} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerFlipDemo(): ReactElement {
  const [flip, setFlip] = useState({horizontal: false, vertical: false})

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* preview */}
      <ImageViewer.Root
        className="w-full"
        flip={flip}
        onFlipChange={(details) => setFlip(details.flip)}
      >
        <ImageViewer.Viewport>
          <ImageViewer.Image
            alt="Earth at night viewed from space"
            src="/images/connected-l.png"
          />
        </ImageViewer.Viewport>
      </ImageViewer.Root>
      <div className="flex items-center gap-2">
        <IconButton
          aria-label="Flip horizontally"
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
      </div>
      {/* preview */}
    </div>
  )
}
