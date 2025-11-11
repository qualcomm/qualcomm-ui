import type {ScopeDomIds, ScopeWithIds} from "@qualcomm-ui/utils/machine"

import type {AvatarElementIds, AvatarSchema} from "../avatar.types"

type Scope = ScopeWithIds<AvatarSchema>

export const domIds: ScopeDomIds<AvatarElementIds, Scope> = {
  content: (scope) => scope.ids.get("content"),
  image: (scope) => scope.ids.get("image"),
  root: (scope) => scope.ids.get("root"),
  status: (scope) => scope.ids.get("status"),
}

export const domEls = {
  content: (scope: Scope): HTMLElement | null =>
    scope.getById<HTMLElement>(domIds.content(scope)),
  image: (scope: Scope): HTMLImageElement | null =>
    scope.getById<HTMLImageElement>(domIds.image(scope)),
  root: (scope: Scope): HTMLElement | null =>
    scope.getById<HTMLElement>(domIds.root(scope)),
  status: (scope: Scope): HTMLElement | null =>
    scope.getById<HTMLElement>(domIds.status(scope)),
}
