import {Tooltip as SimpleTooltip, type TooltipProps} from "./tooltip"
import {TooltipContent, type TooltipContentProps} from "./tooltip-content"
import {
  TooltipPositioner,
  type TooltipPositionerProps,
} from "./tooltip-positioner"
import {TooltipRoot, type TooltipRootProps} from "./tooltip-root"
import {TooltipTrigger, type TooltipTriggerProps} from "./tooltip-trigger"

export type {
  TooltipContentProps,
  TooltipPositionerProps,
  TooltipProps,
  TooltipRootProps,
  TooltipTriggerProps,
}

type TooltipComponent = typeof SimpleTooltip & {
  Content: typeof TooltipContent
  Positioner: typeof TooltipPositioner
  Root: typeof TooltipRoot
  Trigger: typeof TooltipTrigger
}

export const Tooltip: TooltipComponent = SimpleTooltip as TooltipComponent

Tooltip.Content = TooltipContent
Tooltip.Positioner = TooltipPositioner
Tooltip.Root = TooltipRoot
Tooltip.Trigger = TooltipTrigger
