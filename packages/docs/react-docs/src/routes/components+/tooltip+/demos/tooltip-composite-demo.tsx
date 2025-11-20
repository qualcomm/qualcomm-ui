import type {ReactElement} from "react"

import {Button} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"
import {Portal} from "@qualcomm-ui/react-core/portal"

export function TooltipCompositeDemo(): ReactElement {
  return (
    // preview
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Button emphasis="primary">Hover me</Button>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>
            <Tooltip.Arrow>
              <Tooltip.ArrowTip />
            </Tooltip.Arrow>
            Hello world!
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
    // preview
  )
}
