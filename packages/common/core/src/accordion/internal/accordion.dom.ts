import {nextById, prevById, queryAll} from "@qualcomm-ui/dom/query"
import type {ScopeDomIds, ScopeWithIds} from "@qualcomm-ui/utils/machine"

import type {AccordionElementIds, AccordionSchema} from "../accordion.types"

type Scope = ScopeWithIds<AccordionSchema>

export const domIds: ScopeDomIds<AccordionElementIds, Scope> = {
  content: (scope, itemKey) => scope.ids.collection("content").get(itemKey),
  item: (scope, itemKey) => scope.ids.collection("item").get(itemKey),
  root: (scope) => scope.ids.get("root"),
  trigger: (scope, itemKey) => scope.ids.collection("trigger").get(itemKey),
}

function getTriggerEls(scope: Scope): HTMLElement[] {
  const rootId = domIds.root(scope)
  const rootEl = scope.getById(rootId)
  const selector = `[aria-controls][data-ownedby='${rootId}']:not([disabled])`
  return queryAll(rootEl, selector)
}

export function getNextTriggerEl(scope: Scope, id: string): HTMLElement | null {
  return nextById(getTriggerEls(scope), domIds.trigger(scope, id) ?? "")
}

export function getPrevTriggerEl(scope: Scope, id: string): HTMLElement | null {
  return prevById(getTriggerEls(scope), domIds.trigger(scope, id) ?? "")
}

export function getFirstTriggerEl(scope: Scope): HTMLElement | null {
  const triggerEls = getTriggerEls(scope)
  return triggerEls.length > 0 ? triggerEls[0] : null
}
export function getLastTriggerEl(scope: Scope): HTMLElement | null {
  const triggerEls = getTriggerEls(scope)
  return triggerEls.length > 0 ? triggerEls[triggerEls.length - 1] : null
}
