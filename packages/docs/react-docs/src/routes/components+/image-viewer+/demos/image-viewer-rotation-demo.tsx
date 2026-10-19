import {type ReactElement, useState} from "react"

import {RotateCcw, RotateCw} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerRotationDemo(): ReactElement {
  const [rotation, setRotation] = useState(0)

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* preview */}
      <ImageViewer.Root
        className="w-full"
        onRotationChange={(details) => setRotation(details.rotation)}
        rotation={rotation}
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
          aria-label="Rotate counter-clockwise"
          icon={RotateCcw}
          onClick={() => setRotation((currentRotation) => currentRotation - 90)}
          variant="outline"
        />
        <output>{rotation}°</output>
        <IconButton
          aria-label="Rotate clockwise"
          icon={RotateCw}
          onClick={() => setRotation((currentRotation) => currentRotation + 90)}
          variant="outline"
        />
      </div>
      {/* preview */}
    </div>
  )
}
