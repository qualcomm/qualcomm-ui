import {
  CoreStepperCompletedContent,
  type CoreStepperCompletedContentProps,
  CoreStepperContent,
  type CoreStepperContentProps,
  CoreStepperContext,
  type CoreStepperContextProps,
  CoreStepperHint,
  type CoreStepperHintProps,
  CoreStepperIndicator,
  type CoreStepperIndicatorProps,
  CoreStepperItem,
  type CoreStepperItemProps,
  CoreStepperLabel,
  type CoreStepperLabelProps,
  CoreStepperList,
  type CoreStepperListProps,
  CoreStepperNextTrigger,
  type CoreStepperNextTriggerProps,
  CoreStepperPrevTrigger,
  type CoreStepperPrevTriggerProps,
  CoreStepperRoot,
  type CoreStepperRootProps,
  CoreStepperRootProvider,
  type CoreStepperRootProviderProps,
  CoreStepperSeparator,
  type CoreStepperSeparatorProps,
  CoreStepperTrigger,
  type CoreStepperTriggerProps,
} from "./core-stepper"

export * from "./stepper-item-context"
export * from "./use-steps"
export * from "./stepper-context"

export type {
  CoreStepperRootProviderProps,
  CoreStepperRootProps,
  CoreStepperListProps,
  CoreStepperItemProps,
  CoreStepperTriggerProps,
  CoreStepperLabelProps,
  CoreStepperHintProps,
  CoreStepperIndicatorProps,
  CoreStepperSeparatorProps,
  CoreStepperCompletedContentProps,
  CoreStepperContentProps,
  CoreStepperNextTriggerProps,
  CoreStepperPrevTriggerProps,
  CoreStepperContextProps,
}

type CoreStepperComponent = {
  CompletedContent: typeof CoreStepperCompletedContent
  Content: typeof CoreStepperContent
  Context: typeof CoreStepperContext
  Hint: typeof CoreStepperHint
  Indicator: typeof CoreStepperIndicator
  Item: typeof CoreStepperItem
  Label: typeof CoreStepperLabel
  List: typeof CoreStepperList
  NextTrigger: typeof CoreStepperNextTrigger
  PrevTrigger: typeof CoreStepperPrevTrigger
  Root: typeof CoreStepperRoot
  RootProvider: typeof CoreStepperRootProvider
  Separator: typeof CoreStepperSeparator
  Trigger: typeof CoreStepperTrigger
}

export const CoreStepper: CoreStepperComponent = {
  CompletedContent: CoreStepperCompletedContent,
  Content: CoreStepperContent,
  Context: CoreStepperContext,
  Hint: CoreStepperHint,
  Indicator: CoreStepperIndicator,
  Item: CoreStepperItem,
  Label: CoreStepperLabel,
  List: CoreStepperList,
  NextTrigger: CoreStepperNextTrigger,
  PrevTrigger: CoreStepperPrevTrigger,
  Root: CoreStepperRoot,
  RootProvider: CoreStepperRootProvider,
  Separator: CoreStepperSeparator,
  Trigger: CoreStepperTrigger,
}
