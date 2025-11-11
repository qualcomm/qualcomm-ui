import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  CollapsibleElementIds,
  CollapsibleScope,
} from "../collapsible.types"

export const domIds: ScopeDomIds<CollapsibleElementIds, CollapsibleScope> = {
  content: (scope) => scope.ids.get("content"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<CollapsibleElementIds, CollapsibleScope> =
  {
    content: (scope) => scope.getById(domIds.content(scope)),
    trigger: (scope) => scope.getById(domIds.trigger(scope)),
  }
