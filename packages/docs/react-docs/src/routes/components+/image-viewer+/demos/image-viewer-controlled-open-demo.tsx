import {useState, type ReactElement} from "react"

import {ImageViewer} from "@qualcomm-ui/react/image-viewer"

export function ImageViewerControlledOpenDemo(): ReactElement {
  const [open, setOpen] = useState(false)

  return (
    <ImageViewer
      alt="Scenic view of a lake in the mountains"
      className="w-full"
      onOpenChange={setOpen}
      open={open}
      src="/images/nature-2.avif"
    />
  )
}
