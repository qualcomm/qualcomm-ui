import {X} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"

export function Demo({scale}: {scale: boolean}) {
  return (
    <div>
      <InlineIconButton aria-label="Close" icon={X} />
      <InlineIconButton
        aria-label="Clear"
        emphasis="persistent-white"
        icon={X}
        size="sm"
        variant="scale"
      />
      <InlineIconButton
        aria-label="Remove"
        icon={X}
        variant={scale ? "scale" : "fixed"}
      ></InlineIconButton>
    </div>
  )
}
