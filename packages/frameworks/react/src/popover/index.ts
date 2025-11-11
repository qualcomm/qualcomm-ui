import {type PopoverProps, Popover as SimplePopover} from "./popover"
import {PopoverAnchor, type PopoverAnchorProps} from "./popover-anchor"
import {PopoverArrow, type PopoverArrowProps} from "./popover-arrow"
import {PopoverArrowTip, type PopoverArrowTipProps} from "./popover-arrow-tip"
import {
  PopoverCloseTrigger,
  type PopoverCloseTriggerProps,
} from "./popover-close-trigger"
import {PopoverContent, type PopoverContentProps} from "./popover-content"
import {
  PopoverDescription,
  type PopoverDescriptionProps,
} from "./popover-description"
import {PopoverIndicator, type PopoverIndicatorProps} from "./popover-indicator"
import {PopoverLabel, type PopoverLabelProps} from "./popover-label"
import {
  PopoverPositioner,
  type PopoverPositionerProps,
} from "./popover-positioner"
import {PopoverRoot, type PopoverRootProps} from "./popover-root"
import {PopoverTrigger, type PopoverTriggerProps} from "./popover-trigger"

export type {
  PopoverAnchorProps,
  PopoverArrowTipProps,
  PopoverArrowProps,
  PopoverCloseTriggerProps,
  PopoverContentProps,
  PopoverDescriptionProps,
  PopoverIndicatorProps,
  PopoverLabelProps,
  PopoverPositionerProps,
  PopoverProps,
  PopoverRootProps,
  PopoverTriggerProps,
}

type PopoverComponent = typeof SimplePopover & {
  Anchor: typeof PopoverAnchor
  Arrow: typeof PopoverArrow
  ArrowTip: typeof PopoverArrowTip
  CloseTrigger: typeof PopoverCloseTrigger
  Content: typeof PopoverContent
  Description: typeof PopoverDescription
  Indicator: typeof PopoverIndicator
  Label: typeof PopoverLabel
  Positioner: typeof PopoverPositioner
  Root: typeof PopoverRoot
  Trigger: typeof PopoverTrigger
}

export const Popover: PopoverComponent = SimplePopover as PopoverComponent

Popover.Anchor = PopoverAnchor
Popover.Arrow = PopoverArrow
Popover.ArrowTip = PopoverArrowTip
Popover.CloseTrigger = PopoverCloseTrigger
Popover.Content = PopoverContent
Popover.Description = PopoverDescription
Popover.Indicator = PopoverIndicator
Popover.Label = PopoverLabel
Popover.Positioner = PopoverPositioner
Popover.Root = PopoverRoot
Popover.Trigger = PopoverTrigger
