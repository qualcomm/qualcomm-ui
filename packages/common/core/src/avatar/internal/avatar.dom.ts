// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

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
