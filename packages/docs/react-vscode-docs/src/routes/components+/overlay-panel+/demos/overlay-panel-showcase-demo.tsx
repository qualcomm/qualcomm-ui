import type {ReactNode} from "react"

import {Button} from "@qualcomm-ui/react-vscode/button"
import {
  OverlayPanel,
  OverlayPanelContent,
  OverlayPanelTrigger,
} from "@qualcomm-ui/react-vscode/overlay-panel"

export function OverlayPanelShowcaseDemo(): ReactNode {
  return (
    <OverlayPanel>
      <OverlayPanelTrigger>
        {(bindings) => <Button {...bindings}>Default</Button>}
      </OverlayPanelTrigger>
      <OverlayPanelContent>
        <div className="flex place-items-center p-2">Panel content</div>
      </OverlayPanelContent>
    </OverlayPanel>
  )
}
