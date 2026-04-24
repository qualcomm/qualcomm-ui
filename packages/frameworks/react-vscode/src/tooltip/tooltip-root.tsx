import type {ReactElement, ReactNode} from "react"

import type {TooltipApiProps} from "@qualcomm-ui/core/tooltip"
import {
  TooltipContextProvider,
  useTooltip,
} from "@qualcomm-ui/react-core/tooltip"

export interface TooltipRootProps extends TooltipApiProps {
  children?: ReactNode
}

/**
 * The main component that wraps the trigger and the content elements. Doesn't
 * render anything by itself.
 */
export function TooltipRoot({
  children,
  ...props
}: TooltipRootProps): ReactElement {
  return (
    <TooltipContextProvider value={useTooltip(props)}>
      {children}
    </TooltipContextProvider>
  )
}
