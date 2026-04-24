import {StepIndicator, type StepIndicatorProps} from "./step-indicator"
import {StepItem, type StepItemProps} from "./step-item"
import {StepList, type StepListProps} from "./step-list"
import {StepSeparator, type StepSeparatorProps} from "./step-separator"
import {StepTrigger, type StepTriggerProps} from "./step-trigger"
import {StepsRoot, type StepsRootProps} from "./steps-root"

export const Steps: {
  Indicator: typeof StepIndicator
  Item: typeof StepItem
  List: typeof StepList
  Root: typeof StepsRoot
  Separator: typeof StepSeparator
  Trigger: typeof StepTrigger
} = {
  Indicator: StepIndicator,
  Item: StepItem,
  List: StepList,
  Root: StepsRoot,
  Separator: StepSeparator,
  Trigger: StepTrigger,
}

export type {
  StepListProps,
  StepTriggerProps,
  StepItemProps,
  StepsRootProps,
  StepIndicatorProps,
  StepSeparatorProps,
}
