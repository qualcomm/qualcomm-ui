import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {DialogElementIds, DialogScope} from "../dialog.types"

export const domIds: ScopeDomIds<DialogElementIds, DialogScope> = {
  backdrop: (scope) => scope.ids.get("backdrop"),
  closeTrigger: (scope) => scope.ids.get("closeTrigger"),
  content: (scope) => scope.ids.get("content"),
  description: (scope) => scope.ids.get("description"),
  label: (scope) => scope.ids.get("label"),
  positioner: (scope) => scope.ids.get("positioner"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<DialogElementIds, DialogScope> = {
  backdrop: (scope) => scope.getById(domIds.backdrop(scope)),
  closeTrigger: (scope) => scope.getById(domIds.closeTrigger(scope)),
  content: (scope) => scope.getById(domIds.content(scope)),
  description: (scope) => scope.getById(domIds.description(scope)),
  label: (scope) => scope.getById(domIds.label(scope)),
  positioner: (scope) => scope.getById(domIds.positioner(scope)),
  trigger: (scope) => scope.getById(domIds.trigger(scope)),
}
