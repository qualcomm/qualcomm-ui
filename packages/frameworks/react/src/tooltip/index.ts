import {Tooltip as SimpleTooltip} from "./tooltip"
import {TooltipArrow, type TooltipArrowProps} from "./tooltip-arrow"
import {TooltipArrowTip, type TooltipArrowTipProps} from "./tooltip-arrow-tip"
import {TooltipContent, type TooltipContentProps} from "./tooltip-content"
import {
  TooltipPositioner,
  type TooltipPositionerProps,
} from "./tooltip-positioner"
import {TooltipRoot, type TooltipRootProps} from "./tooltip-root"
import {TooltipTrigger, type TooltipTriggerProps} from "./tooltip-trigger"

export type {
  TooltipArrowTipProps,
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPositionerProps,
  TooltipRootProps,
  TooltipTriggerProps,
}

type TooltipComponent = typeof SimpleTooltip & {
  /**
   * The container that positions the arrow. This element renders the
   * `<Tooltip.ArrowTip/>` by default if no children are provided.
   */
  Arrow: typeof TooltipArrow
  /**
   * The arrow tip element. Renders a `<div>` element by default.
   */
  ArrowTip: typeof TooltipArrowTip
  /**
   * The content of the tooltip which is displayed relative to the trigger. Renders a
   * `<div>` element by default.
   */
  Content: typeof TooltipContent
  /**
   * The element that positions the tooltip content relative to the trigger. Renders
   * a `<div>` element by default.
   */
  Positioner: typeof TooltipPositioner
  /**
   * The main component that wraps the trigger and the content elements. Doesn't
   * render anything by itself.
   */
  Root: typeof TooltipRoot
  /**
   * A trigger that opens the tooltip.  Doesn't render anything by itself. Applies
   * event handlers and attributes to the child element.
   */
  Trigger: typeof TooltipTrigger
}

export const Tooltip: TooltipComponent = SimpleTooltip as TooltipComponent

Tooltip.ArrowTip = TooltipArrowTip
Tooltip.Arrow = TooltipArrow
Tooltip.Content = TooltipContent
Tooltip.Positioner = TooltipPositioner
Tooltip.Root = TooltipRoot
Tooltip.Trigger = TooltipTrigger
