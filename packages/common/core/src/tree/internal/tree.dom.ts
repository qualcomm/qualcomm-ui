import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {TreeElementIds, TreeScope} from "../tree.types"

export const domIds: ScopeDomIds<TreeElementIds, TreeScope> = {
  label: (scope) => scope.ids.get("label"),
  root: (scope) => scope.ids.get("root"),
}

export const domEls: ScopeDomElements<TreeElementIds, TreeScope> = {
  label: (scope) => scope.getById(domIds.label(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
}

export function getNodeId(ctx: TreeScope, value: string): string {
  return `tree:${domIds.root(ctx)}:node:${value}`
}

export function getNodeTextId(ctx: TreeScope, value: string) {
  return `${getNodeId(ctx, value)}:text`
}

export function focusNode(
  ctx: TreeScope,
  value: string | null | undefined,
): void {
  if (value == null) {
    return
  }
  ctx.getById(getNodeId(ctx, value))?.focus()
}
