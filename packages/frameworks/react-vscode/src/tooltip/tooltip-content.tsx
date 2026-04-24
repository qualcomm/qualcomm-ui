import type {ReactElement, ReactNode} from "react"

import {useTooltipContent, useTooltipPositioner} from "@qualcomm-ui/react-core/tooltip"
import {Portal} from "@qualcomm-ui/react-core/portal"
import {clsx} from "@qualcomm-ui/utils/clsx"

/**
 * @public
 */
export interface TooltipContentProps {
  children: ReactNode
  className?: string
}

export function TooltipContent({
  children,
  className,
}: TooltipContentProps): ReactElement {
  const positionerBindings = useTooltipPositioner({})
  const contentBindings = useTooltipContent({})

  return (
    <Portal>
      <div {...positionerBindings}>
        <div
          className={clsx("vs-tooltip", className)}
          {...contentBindings}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}
