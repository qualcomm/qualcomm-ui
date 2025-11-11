import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {SideNavElementIds, SideNavScope} from "../side-nav.types"

export const domIds: ScopeDomIds<SideNavElementIds, SideNavScope> = {
  root: (scope) => scope.ids.get("root"),
  trigger: (scope) => scope.ids.get("trigger"),
}

export const domEls: ScopeDomElements<SideNavElementIds, SideNavScope> = {
  root: (scope) => scope.getById(domIds.root(scope)),
  trigger: (scope) => scope.getById(domIds.trigger(scope)),
}
