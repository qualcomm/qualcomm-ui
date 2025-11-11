import {queryAll} from "@qualcomm-ui/dom/query"
import type {
  ScopeDomElements,
  ScopeDomIds,
  ScopeWithIds,
} from "@qualcomm-ui/utils/machine"

import type {RadioElementIds, RadioSchema} from "../radio.types"

type Scope = ScopeWithIds<RadioSchema>

export const domIds: ScopeDomIds<RadioElementIds, Scope> = {
  errorText: (scope) => scope.ids.get("errorText"),
  item: (scope, itemKey) => scope.ids.collection("item").get(itemKey),
  itemHiddenInput: (scope, itemKey) =>
    scope.ids.collection("itemHiddenInput").get(itemKey),
  itemLabel: (scope, itemKey) => scope.ids.collection("itemLabel").get(itemKey),
  label: (scope) => scope.ids.get("label"),
  root: (scope) => scope.ids.get("root"),
}

export const domEls: ScopeDomElements<RadioElementIds, Scope> = {
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  item: (scope, itemKey) => scope.getById(domIds.item(scope, itemKey)!),
  itemHiddenInput: (scope, itemKey) =>
    scope.getById(domIds.itemHiddenInput(scope, itemKey)!),
  itemLabel: (scope, itemKey) =>
    scope.getById(domIds.itemLabel(scope, itemKey)!),
  label: (scope) => scope.getById(domIds.label(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
}

export function getInputEls(ctx: Scope): HTMLInputElement[] {
  const ownerId = CSS.escape(domIds.root(ctx))
  const selector = `input[type=radio][data-ownedby='${ownerId}']:not([disabled])`
  return queryAll<HTMLInputElement>(domEls.root(ctx), selector)
}

export function getFirstEnabledInputEl(
  ctx: Scope,
): HTMLInputElement | null | undefined {
  return domEls
    .root(ctx)
    ?.querySelector<HTMLInputElement>("input:not(:disabled)")
}

export function getFirstEnabledAndCheckedInputEl(
  ctx: Scope,
): HTMLInputElement | null | undefined {
  return domEls
    .root(ctx)
    ?.querySelector<HTMLInputElement>("input:not(:disabled):checked")
}
