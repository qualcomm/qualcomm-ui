import {
  CoreToastActionTrigger,
  type CoreToastActionTriggerProps,
  CoreToastCloseTrigger,
  type CoreToastCloseTriggerProps,
  CoreToastDescription,
  type CoreToastDescriptionProps,
  CoreToastLabel,
  type CoreToastLabelProps,
  CoreToastRoot,
  type CoreToastRootProps,
} from "./core-toast.js"

export * from "./toast-context.js"
export * from "./toaster.js"

export type {
  CoreToastRootProps,
  CoreToastLabelProps,
  CoreToastDescriptionProps,
  CoreToastCloseTriggerProps,
  CoreToastActionTriggerProps,
}

type CoreToastComponent = {
  ActionTrigger: typeof CoreToastActionTrigger
  CloseTrigger: typeof CoreToastCloseTrigger
  Description: typeof CoreToastDescription
  Label: typeof CoreToastLabel
  Root: typeof CoreToastRoot
}

export const CoreToast: CoreToastComponent = {
  ActionTrigger: CoreToastActionTrigger,
  CloseTrigger: CoreToastCloseTrigger,
  Description: CoreToastDescription,
  Label: CoreToastLabel,
  Root: CoreToastRoot,
}
