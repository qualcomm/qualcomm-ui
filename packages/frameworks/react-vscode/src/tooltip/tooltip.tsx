import type {ReactElement, ReactNode} from "react"

import type {TooltipApiProps} from "@qualcomm-ui/core/tooltip"
import {TooltipContextProvider, useTooltip} from "@qualcomm-ui/react-core/tooltip"

/**
 * @public
 */
export type TooltipProps = TooltipApiProps & {
  children: ReactNode
}

export function Tooltip({children, ...props}: TooltipProps): ReactElement {
  const context = useTooltip(props)

  return (
    <TooltipContextProvider value={context}>{children}</TooltipContextProvider>
  )
}
