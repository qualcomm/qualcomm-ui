// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {waitForElement} from "@qualcomm-ui/dom/query"
import {isSizeEqual} from "@qualcomm-ui/dom/rect-utils"
import type {
  Machine,
  ScopeDomElements,
  ScopeDomIds,
} from "@qualcomm-ui/utils/machine"

import type {
  ImageViewerElementIds,
  ImageViewerScope,
  ImageViewerSchema,
} from "./image-viewer.types.js"
import {clampOffset, getFittedImageSize, isVisibleRect} from "./utils/crop.js"

export const domIds: ScopeDomIds<ImageViewerElementIds, ImageViewerScope> = {
  root: (scope) => scope.ids.get("root"),
  viewport: (scope) => scope.ids.get("viewport"),
  viewportImage: (scope) => scope.ids.get("viewportImage"),
}

export const domEls: ScopeDomElements<
  ImageViewerElementIds,
  ImageViewerScope,
  {viewportImage: HTMLImageElement | null}
> = {
  root: (scope) => scope.getById(domIds.root(scope)),
  viewport: (scope) => scope.getById(domIds.viewport(scope)),
  viewportImage: (scope) =>
    scope.getById<HTMLImageElement>(domIds.viewportImage(scope)),
}

/** Wait for lazy popup content and dispose its listeners when the state exits. */
export function trackViewport(
  scope: ImageViewerScope,
  setup: (element: HTMLElement) => VoidFunction,
): VoidFunction {
  let cleanup: VoidFunction | undefined
  const cancel = waitForElement(
    () => domEls.viewport(scope),
    (element) => {
      cleanup = setup(element)
    },
  )
  return () => {
    cancel()
    cleanup?.()
  }
}

/** Measures and applies the viewport geometry synchronously before paint. */
export function measureImageViewerViewport({
  context,
  scope,
}: Pick<Machine<ImageViewerSchema>, "context" | "scope">): void {
  const viewportEl = domEls.viewport(scope)
  if (!viewportEl) {
    return
  }

  const newViewportRect = viewportEl.getBoundingClientRect()
  if (!isVisibleRect(newViewportRect)) {
    return
  }

  const oldViewportRect = context.get("viewportRect")

  if (
    isSizeEqual(oldViewportRect, newViewportRect) &&
    oldViewportRect.left === newViewportRect.left &&
    oldViewportRect.top === newViewportRect.top
  ) {
    return
  }

  context.set("viewportRect", newViewportRect)
  context.set(
    "offset",
    clampOffset({
      imageSize: getFittedImageSize(
        context.get("naturalSize"),
        newViewportRect,
        context.get("rotation"),
      ),
      offset: context.get("offset"),
      rotation: context.get("rotation"),
      viewportSize: newViewportRect,
      zoom: context.get("zoom"),
    }),
  )
}
