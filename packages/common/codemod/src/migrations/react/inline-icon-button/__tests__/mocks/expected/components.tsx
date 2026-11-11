import {X} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"

export function Demo({scale}: {scale: boolean}) {
  return (
    <div>
      <IconButton density="compact" variant="ghost" aria-label="Close" icon={X} />
      <IconButton
        density="compact"
        aria-label="Clear"
        emphasis="persistent-white"
        icon={X}
        size="sm"
        variant="ghost"
      />
      <IconButton
        density="compact"
        aria-label="Remove"
        icon={X}
        variant="ghost"
      ></IconButton>
    </div>
  )
}
