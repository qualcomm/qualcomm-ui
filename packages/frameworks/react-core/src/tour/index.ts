import {
  CoreTourActionTrigger,
  type CoreTourActionTriggerProps,
  CoreTourArrow,
  type CoreTourArrowProps,
  CoreTourArrowTip,
  type CoreTourArrowTipProps,
  CoreTourBackdrop,
  type CoreTourBackdropProps,
  CoreTourCloseTrigger,
  type CoreTourCloseTriggerProps,
  CoreTourContent,
  type CoreTourContentProps,
  CoreTourContext,
  type CoreTourContextProps,
  CoreTourDescription,
  type CoreTourDescriptionProps,
  CoreTourHeading,
  type CoreTourHeadingProps,
  CoreTourPositioner,
  type CoreTourPositionerProps,
  CoreTourProgressText,
  type CoreTourProgressTextProps,
  CoreTourRoot,
  type CoreTourRootProps,
  CoreTourSpotlight,
  type CoreTourSpotlightProps,
} from "./core-tour.js"

export type {
  CoreTourActionTriggerProps,
  CoreTourArrowProps,
  CoreTourArrowTipProps,
  CoreTourBackdropProps,
  CoreTourCloseTriggerProps,
  CoreTourContentProps,
  CoreTourContextProps,
  CoreTourDescriptionProps,
  CoreTourHeadingProps,
  CoreTourPositionerProps,
  CoreTourProgressTextProps,
  CoreTourRootProps,
  CoreTourSpotlightProps,
}

type CoreTourComponent = {
  ActionTrigger: typeof CoreTourActionTrigger
  Arrow: typeof CoreTourArrow
  ArrowTip: typeof CoreTourArrowTip
  Backdrop: typeof CoreTourBackdrop
  CloseTrigger: typeof CoreTourCloseTrigger
  Content: typeof CoreTourContent
  Context: typeof CoreTourContext
  Description: typeof CoreTourDescription
  Heading: typeof CoreTourHeading
  Positioner: typeof CoreTourPositioner
  ProgressText: typeof CoreTourProgressText
  Root: typeof CoreTourRoot
  Spotlight: typeof CoreTourSpotlight
}

export const CoreTour: CoreTourComponent = {
  ActionTrigger: CoreTourActionTrigger,
  Arrow: CoreTourArrow,
  ArrowTip: CoreTourArrowTip,
  Backdrop: CoreTourBackdrop,
  CloseTrigger: CoreTourCloseTrigger,
  Content: CoreTourContent,
  Context: CoreTourContext,
  Description: CoreTourDescription,
  Heading: CoreTourHeading,
  Positioner: CoreTourPositioner,
  ProgressText: CoreTourProgressText,
  Root: CoreTourRoot,
  Spotlight: CoreTourSpotlight,
}
