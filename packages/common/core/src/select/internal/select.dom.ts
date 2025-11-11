import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {SelectElementIds, SelectScope} from "../select.types"

export const domIds: ScopeDomIds<SelectElementIds, SelectScope> & {
  itemGroup: (scope: SelectScope, id: string | number) => string
} = {
  clearTrigger: (scope) => scope.ids.get("clearTrigger"),
  content: (scope) => scope.ids.get("content"),
  control: (scope) => scope.ids.get("control"),
  errorText: (scope) => scope.ids.get("errorText"),
  hiddenSelect: (scope) => scope.ids.get("hiddenSelect"),
  hint: (scope) => scope.ids.get("hint"),
  item: (scope, id) => `${scope.ids.get("root")}-item-${id}`,
  itemGroup: (scope, id) => `${scope.ids.get("root")}-item-group-${id}`,
  itemGroupLabel: (scope, id) =>
    `${scope.ids.get("root")}-item-group-label-${id}`,
  label: (scope) => scope.ids.get("label"),
  positioner: (scope) => scope.ids.get("positioner"),
  root: (scope) => scope.ids.get("root"),
}

export const domEls: ScopeDomElements<
  Omit<SelectElementIds, "itemGroup" | "itemGroupLabel" | "hiddenSelect">,
  SelectScope
> & {
  hiddenSelect: (scope: SelectScope) => HTMLSelectElement | null
} = {
  clearTrigger: (scope) => scope.getById(domIds.clearTrigger(scope)),
  content: (scope) => scope.getById(domIds.content(scope)),
  control: (scope) => scope.getById(domIds.control(scope)),
  errorText: (scope) => scope.getById(domIds.errorText(scope)),
  hiddenSelect: (scope) => scope.getById(domIds.hiddenSelect(scope)),
  hint: (scope) => scope.getById(domIds.hint(scope)),
  item: (scope, id) => scope.getById(domIds.item?.(scope, id)),
  label: (scope) => scope.getById(domIds.label?.(scope)),
  positioner: (scope) => scope.getById(domIds.positioner(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
}
