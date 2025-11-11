import type {ReactElement} from "react"

import {RotateCcw} from "lucide-react"

import {IconButton} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

export function ResetDemoDimensionsButton(): ReactElement | null {
  const onClick = () => {
    if (import.meta.hot) {
      import.meta.hot.send("custom:reset-demo-dimensions")
      if (typeof window !== "undefined") {
        window.location.reload()
      }
    }
  }

  return import.meta.env.DEV ? (
    <Tooltip
      trigger={
        <IconButton
          aria-label="Reset Demo Height State"
          emphasis="neutral"
          icon={<Icon icon={RotateCcw} size={14} />}
          onClick={onClick}
          size="sm"
          variant="ghost"
        />
      }
    >
      Reset demo height state
    </Tooltip>
  ) : null
}
