import {
  StepperCompletedContent,
  type StepperCompletedContentProps,
} from "./stepper-completed-content.js"
import {StepperContent, type StepperContentProps} from "./stepper-content.js"
import {StepperContext, type StepperContextProps} from "./stepper-context.js"
import {StepperHint, type StepperHintProps} from "./stepper-hint.js"
import {
  StepperIndicatorIcon,
  type StepperIndicatorIconProps,
} from "./stepper-indicator-icon.js"
import {
  StepperIndicator,
  type StepperIndicatorProps,
} from "./stepper-indicator.js"
import {StepperItem, type StepperItemProps} from "./stepper-item.js"
import {StepperLabel, type StepperLabelProps} from "./stepper-label.js"
import {StepperList, type StepperListProps} from "./stepper-list.js"
import {
  StepperNextTrigger,
  type StepperNextTriggerProps,
} from "./stepper-next-trigger.js"
import {
  StepperPrevTrigger,
  type StepperPrevTriggerProps,
} from "./stepper-prev-trigger.js"
import {StepperRoot, type StepperRootProps} from "./stepper-root.js"
import {
  StepperSeparator,
  type StepperSeparatorProps,
} from "./stepper-separator.js"
import {StepperTrigger, type StepperTriggerProps} from "./stepper-trigger.js"

export * from "./qds-stepper-context.js"
export type {
  StepperPrevTriggerProps,
  StepperIndicatorProps,
  StepperCompletedContentProps,
  StepperRootProps,
  StepperTriggerProps,
  StepperListProps,
  StepperNextTriggerProps,
  StepperIndicatorIconProps,
  StepperHintProps,
  StepperLabelProps,
  StepperItemProps,
  StepperSeparatorProps,
  StepperContextProps,
  StepperContentProps,
}

type StepperComponent = {
  /**
   * Content area displayed when all steps are completed. Renders a `<div>` element
   * by default.
   */
  CompletedContent: typeof StepperCompletedContent
  /**
   * Content area for a step. Renders a `<div>` element by default.
   */
  Content: typeof StepperContent
  /**
   * Render prop that provides the current stepper API context.
   */
  Context: typeof StepperContext
  /**
   * Displays a step subtitle or hint. Renders a `<span>` element by default.
   */
  Hint: typeof StepperHint
  /**
   * Visual indicator for the step state. Renders a `<div>` element by default.
   *
   * By default, displays the step number or icon. When a step is completed, it
   * shows a checkmark icon. When a step is invalid, it shows an error icon.
   *
   * Rendering order:
   *
   * - errorIcon (when invalid)
   * - children (current step)
   * - completedIcon (when complete)
   * - children (not current step)
   */
  Indicator: typeof StepperIndicator
  IndicatorIcon: typeof StepperIndicatorIcon
  /**
   * Wrapper for a single step. Renders a `<div>` element by default.
   */
  Item: typeof StepperItem
  /**
   * Displays the step title. Renders a `<span>` element by default.
   */
  Label: typeof StepperLabel
  /**
   * Container for the step items. Renders a `<div>` element by default.
   */
  List: typeof StepperList
  /**
   * Navigates to the next step. Renders a `<button>` element by default.
   */
  NextTrigger: typeof StepperNextTrigger
  /**
   * Navigates to the previous step. Renders a `<button>` element by default.
   */
  PrevTrigger: typeof StepperPrevTrigger
  /**
   * Groups all parts of the stepper. Renders a `<div>` element by default.
   */
  Root: typeof StepperRoot
  /**
   * Visual connector between steps. Renders a `<div>` element by default.
   */
  Separator: typeof StepperSeparator
  /**
   * Used to make each step item clickable. Renders a `<button>` element by default.
   */
  Trigger: typeof StepperTrigger
}

export const Stepper: StepperComponent = {
  CompletedContent: StepperCompletedContent,
  Content: StepperContent,
  Context: StepperContext,
  Hint: StepperHint,
  Indicator: StepperIndicator,
  IndicatorIcon: StepperIndicatorIcon,
  Item: StepperItem,
  Label: StepperLabel,
  List: StepperList,
  NextTrigger: StepperNextTrigger,
  PrevTrigger: StepperPrevTrigger,
  Root: StepperRoot,
  Separator: StepperSeparator,
  Trigger: StepperTrigger,
}
