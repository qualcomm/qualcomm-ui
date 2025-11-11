import type {ReactElement} from "react"

import {RotateCcw} from "lucide-react"

import {HeaderBar} from "@qualcomm-ui/react/header-bar"
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
        <HeaderBar.ActionIconButton
          aria-label="Reset Demo Height State"
          icon={RotateCcw}
          onClick={onClick}
        />
      }
    >
      Reset demo height state
    </Tooltip>
  ) : null
}
