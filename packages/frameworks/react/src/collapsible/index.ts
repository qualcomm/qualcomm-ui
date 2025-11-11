import {
  CollapsibleContent,
  type CollapsibleContentProps,
} from "./collapsible-content"
import {
  CollapsibleContext,
  type CollapsibleContextProps,
} from "./collapsible-context"
import {CollapsibleRoot, type CollapsibleRootProps} from "./collapsible-root"
import {
  CollapsibleTrigger,
  type CollapsibleTriggerProps,
} from "./collapsible-trigger"

export type {
  CollapsibleContentProps,
  CollapsibleContextProps,
  CollapsibleRootProps,
  CollapsibleTriggerProps,
}

type CollapsibleComponent = {
  Content: typeof CollapsibleContent
  Context: typeof CollapsibleContext
  /**
   * Groups all parts of the collapsible. Renders a `<div>` element by default.
   */
  Root: typeof CollapsibleRoot
  Trigger: typeof CollapsibleTrigger
}

export const Collapsible: CollapsibleComponent = {
  Content: CollapsibleContent,
  Context: CollapsibleContext,
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
}
