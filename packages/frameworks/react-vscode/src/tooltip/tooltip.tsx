import type {ReactElement, ReactNode} from "react"

import type {TooltipTriggerBindings} from "@qualcomm-ui/core/tooltip"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import type {BindingRenderProp} from "@qualcomm-ui/react-core/system"

import {TooltipContent, type TooltipContentProps} from "./tooltip-content"
import {
  TooltipPositioner,
  type TooltipPositionerProps,
} from "./tooltip-positioner"
import {TooltipRoot, type TooltipRootProps} from "./tooltip-root"
import {TooltipTrigger} from "./tooltip-trigger"

export interface TooltipProps extends Omit<TooltipRootProps, "children"> {
  /**
   * The text content of the tooltip.
   */
  children?: ReactNode

  /**
   * Props applied to the content element.
   *
   * @inheritDoc
   */
  contentProps?: TooltipContentProps

  /**
   * Props applied to the portal element.
   *
   * @inheritDoc
   */
  portalProps?: PortalProps

  /**
   * Props applied to the positioner element.
   *
   * @inheritDoc
   */
  positionerProps?: TooltipPositionerProps

  /**
   * The element that triggers the tooltip on hover/focus. Supplied as a
   * {@link https://react-next.qui.qualcomm.com/render-props#binding-render-prop Binding Render Prop}.
   */
  trigger: BindingRenderProp<TooltipTriggerBindings>
}

export function Tooltip({
  children,
  contentProps,
  portalProps,
  positionerProps,
  trigger,
  ...props
}: TooltipProps): ReactElement {
  return (
    <TooltipRoot {...props}>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <Portal {...portalProps}>
        <TooltipPositioner {...positionerProps}>
          <TooltipContent {...contentProps}>{children}</TooltipContent>
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  )
}
