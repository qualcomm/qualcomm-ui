import {
  CoreCollapsibleContent,
  type CoreCollapsibleContentProps,
  CoreCollapsibleContext,
  type CoreCollapsibleContextProps,
  CoreCollapsibleRoot,
  type CoreCollapsibleRootProps,
  CoreCollapsibleRootProvider,
  type CoreCollapsibleRootProviderProps,
  CoreCollapsibleTrigger,
  type CoreCollapsibleTriggerProps,
} from "./core-collapsible"

export * from "./collapsible-context"

export type {
  CoreCollapsibleRootProviderProps,
  CoreCollapsibleRootProps,
  CoreCollapsibleContentProps,
  CoreCollapsibleTriggerProps,
  CoreCollapsibleContextProps,
}

type CoreCollapsibleComponent = {
  Content: typeof CoreCollapsibleContent
  Context: typeof CoreCollapsibleContext
  Root: typeof CoreCollapsibleRoot
  RootProvider: typeof CoreCollapsibleRootProvider
  Trigger: typeof CoreCollapsibleTrigger
}

export const CoreCollapsible: CoreCollapsibleComponent = {
  Content: CoreCollapsibleContent,
  Context: CoreCollapsibleContext,
  Root: CoreCollapsibleRoot,
  RootProvider: CoreCollapsibleRootProvider,
  Trigger: CoreCollapsibleTrigger,
}
