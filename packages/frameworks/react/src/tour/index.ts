import {
  TourActionTrigger,
  type TourActionTriggerProps,
} from "./tour-action-trigger.js"
import {TourArrowTip, type TourArrowTipProps} from "./tour-arrow-tip.js"
import {TourArrow, type TourArrowProps} from "./tour-arrow.js"
import {TourBackdrop, type TourBackdropProps} from "./tour-backdrop.js"
import {
  TourCloseButton,
  type TourCloseButtonProps,
} from "./tour-close-button.js"
import {TourContent, type TourContentProps} from "./tour-content.js"
import {TourContext, type TourContextProps} from "./tour-context.js"
import {TourDescription, type TourDescriptionProps} from "./tour-description.js"
import {
  TourFloatingPortal,
  type TourFloatingPortalProps,
} from "./tour-floating-portal.js"
import {TourHeading, type TourHeadingProps} from "./tour-heading.js"
import {TourPositioner, type TourPositionerProps} from "./tour-positioner.js"
import {
  TourProgressText,
  type TourProgressTextProps,
} from "./tour-progress-text.js"
import {TourRoot, type TourRootProps} from "./tour-root.js"
import {TourSpotlight, type TourSpotlightProps} from "./tour-spotlight.js"
import {SimpleTour, type TourProps} from "./tour.js"

export {
  waitForElement,
  waitForElementValue,
  waitForPromise,
} from "@qualcomm-ui/core/tour"
export type {
  Point,
  TourProgressTextDetails,
  TourStatusChangeDetails,
  TourStepAction,
  TourStepActionFn,
  TourStepActionMap,
  TourStepActionType,
  TourStepChangeDetails,
  TourStepEffectArgs,
  TourStepEffectCleanup,
  TourStepPlacement,
  TourStepStatus,
  TourStepType,
  TourTranslations,
  TourWaitOptions,
  TourWaitReturn,
} from "@qualcomm-ui/core/tour"
export * from "./qds-tour-context.js"
export type * from "./tour.types.js"

export type {
  TourActionTriggerProps,
  TourArrowProps,
  TourArrowTipProps,
  TourBackdropProps,
  TourCloseButtonProps,
  TourContentProps,
  TourContextProps,
  TourDescriptionProps,
  TourFloatingPortalProps,
  TourHeadingProps,
  TourPositionerProps,
  TourProgressTextProps,
  TourProps,
  TourRootProps,
  TourSpotlightProps,
}

type TourComponent = typeof SimpleTour & {
  ActionTrigger: typeof TourActionTrigger
  Arrow: typeof TourArrow
  ArrowTip: typeof TourArrowTip
  Backdrop: typeof TourBackdrop
  CloseButton: typeof TourCloseButton
  Content: typeof TourContent
  Context: typeof TourContext
  Description: typeof TourDescription
  FloatingPortal: typeof TourFloatingPortal
  Heading: typeof TourHeading
  Positioner: typeof TourPositioner
  ProgressText: typeof TourProgressText
  Root: typeof TourRoot
  Spotlight: typeof TourSpotlight
}

export const Tour: TourComponent = SimpleTour as TourComponent
Tour.ActionTrigger = TourActionTrigger
Tour.Arrow = TourArrow
Tour.ArrowTip = TourArrowTip
Tour.Backdrop = TourBackdrop
Tour.CloseButton = TourCloseButton
Tour.Content = TourContent
Tour.Context = TourContext
Tour.Description = TourDescription
Tour.FloatingPortal = TourFloatingPortal
Tour.Heading = TourHeading
Tour.Positioner = TourPositioner
Tour.ProgressText = TourProgressText
Tour.Root = TourRoot
Tour.Spotlight = TourSpotlight
