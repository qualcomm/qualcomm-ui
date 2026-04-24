import {
  StepCompletedContent,
  type StepCompletedContentProps,
} from "./step-completed-content"
import {StepContent, type StepContentProps} from "./step-content"
import {StepHint, type StepHintProps} from "./step-hint"
import {StepIndicator, type StepIndicatorProps} from "./step-indicator"
import {
  StepIndicatorIcon,
  type StepIndicatorIconProps,
} from "./step-indicator-icon"
import {StepItem, type StepItemProps} from "./step-item"
import {StepLabel, type StepLabelProps} from "./step-label"
import {StepList, type StepListProps} from "./step-list"
import {StepNextTrigger, type StepNextTriggerProps} from "./step-next-trigger"
import {StepPrevTrigger, type StepPrevTriggerProps} from "./step-prev-trigger"
import {StepSeparator, type StepSeparatorProps} from "./step-separator"
import {StepTrigger, type StepTriggerProps} from "./step-trigger"
import {StepsContext, type StepsContextProps} from "./steps-context"
import {StepsRoot, type StepsRootProps} from "./steps-root"

export type {
  StepCompletedContentProps,
  StepContentProps,
  StepHintProps,
  StepIndicatorIconProps,
  StepIndicatorProps,
  StepItemProps,
  StepLabelProps,
  StepListProps,
  StepNextTriggerProps,
  StepPrevTriggerProps,
  StepSeparatorProps,
  StepTriggerProps,
  StepsContextProps,
  StepsRootProps,
}

export const Steps: {
  CompletedContent: typeof StepCompletedContent
  Content: typeof StepContent
  Context: typeof StepsContext
  Hint: typeof StepHint
  Indicator: typeof StepIndicator
  IndicatorIcon: typeof StepIndicatorIcon
  Item: typeof StepItem
  Label: typeof StepLabel
  List: typeof StepList
  NextTrigger: typeof StepNextTrigger
  PrevTrigger: typeof StepPrevTrigger
  Root: typeof StepsRoot
  Separator: typeof StepSeparator
  Trigger: typeof StepTrigger
} = {
  CompletedContent: StepCompletedContent,
  Content: StepContent,
  Context: StepsContext,
  Hint: StepHint,
  Indicator: StepIndicator,
  IndicatorIcon: StepIndicatorIcon,
  Item: StepItem,
  Label: StepLabel,
  List: StepList,
  NextTrigger: StepNextTrigger,
  PrevTrigger: StepPrevTrigger,
  Root: StepsRoot,
  Separator: StepSeparator,
  Trigger: StepTrigger,
}
