import type {ReactElement} from "react"

import {Portal} from "@qualcomm-ui/react-core/portal"
import {Button} from "@qualcomm-ui/react/button"
import {Tooltip} from "@qualcomm-ui/react/tooltip"

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
