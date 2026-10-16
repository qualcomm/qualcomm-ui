// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ScopeDomElements, ScopeDomIds} from "@qualcomm-ui/utils/machine"

import type {
  ImageViewerElementIds,
  ImageViewerScope,
} from "./image-viewer.types.js"

export const domIds: ScopeDomIds<ImageViewerElementIds, ImageViewerScope> = {
  image: (scope) => scope.ids.get("image"),
  root: (scope) => scope.ids.get("root"),
  viewport: (scope) => scope.ids.get("viewport"),
}

export const domEls: ScopeDomElements<
  ImageViewerElementIds,
  ImageViewerScope,
  {image: HTMLImageElement | null}
> = {
  image: (scope) => scope.getById<HTMLImageElement>(domIds.image(scope)),
  root: (scope) => scope.getById(domIds.root(scope)),
  viewport: (scope) => scope.getById(domIds.viewport(scope)),
}
