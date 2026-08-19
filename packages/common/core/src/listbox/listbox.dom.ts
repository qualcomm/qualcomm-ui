import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {ListboxElementIds, ListboxScope} from "./listbox.types.js"

export const listboxDomIds: ScopeDomIds<ListboxElementIds, ListboxScope> = {
  content: (scope) => scope.ids.get("content"),
  item: (scope, itemKey) => scope.ids.collection("item").get(itemKey),
  itemGroup: (scope, itemKey) => scope.ids.collection("itemGroup").get(itemKey),
  itemGroupLabel: (scope, itemKey) =>
    scope.ids.collection("itemGroupLabel").get(itemKey),
  label: (scope) => scope.ids.get("label"),
  root: (scope) => scope.ids.get("root"),
}

export const listboxDomEls: ScopeDomElements<ListboxElementIds, ListboxScope> =
  {
    content: (scope) => scope.getById(listboxDomIds.content(scope)),
    item: (scope, id) => scope.getById(listboxDomIds.item(scope, id)!),
    itemGroup: (scope, id) =>
      scope.getById(listboxDomIds.itemGroup(scope, id)!),
    itemGroupLabel: (scope, id) =>
      scope.getById(listboxDomIds.itemGroupLabel(scope, id)!),
    label: (scope) => scope.getById(listboxDomIds.label?.(scope)),
    root: (scope) => scope.getById(listboxDomIds.root(scope)),
  }
