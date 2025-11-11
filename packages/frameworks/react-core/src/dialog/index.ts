import {
  CoreDialogBackdrop,
  type CoreDialogBackdropProps,
  CoreDialogBody,
  type CoreDialogBodyProps,
  CoreDialogCloseTrigger,
  type CoreDialogCloseTriggerProps,
  CoreDialogContent,
  type CoreDialogContentProps,
  CoreDialogDescription,
  type CoreDialogDescriptionProps,
  CoreDialogFooter,
  type CoreDialogFooterProps,
  CoreDialogHeading,
  type CoreDialogHeadingProps,
  CoreDialogPositioner,
  type CoreDialogPositionerProps,
  CoreDialogRoot,
  type CoreDialogRootProps,
  CoreDialogTrigger,
  type CoreDialogTriggerProps,
} from "./core-dialog"

export * from "./dialog-context"

export type {
  CoreDialogRootProps,
  CoreDialogContentProps,
  CoreDialogCloseTriggerProps,
  CoreDialogBackdropProps,
  CoreDialogBodyProps,
  CoreDialogFooterProps,
  CoreDialogHeadingProps,
  CoreDialogPositionerProps,
  CoreDialogTriggerProps,
  CoreDialogDescriptionProps,
}

type CoreDialogComponent = {
  Backdrop: typeof CoreDialogBackdrop
  Body: typeof CoreDialogBody
  CloseTrigger: typeof CoreDialogCloseTrigger
  Content: typeof CoreDialogContent
  Description: typeof CoreDialogDescription
  Footer: typeof CoreDialogFooter
  Heading: typeof CoreDialogHeading
  Positioner: typeof CoreDialogPositioner
  Root: typeof CoreDialogRoot
  Trigger: typeof CoreDialogTrigger
}

export const CoreDialog: CoreDialogComponent = {
  Backdrop: CoreDialogBackdrop,
  Body: CoreDialogBody,
  CloseTrigger: CoreDialogCloseTrigger,
  Content: CoreDialogContent,
  Description: CoreDialogDescription,
  Footer: CoreDialogFooter,
  Heading: CoreDialogHeading,
  Positioner: CoreDialogPositioner,
  Root: CoreDialogRoot,
  Trigger: CoreDialogTrigger,
}
