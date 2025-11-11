// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {addDomEvent} from "./event"

export interface ViewportSize {
  height: number
  width: number
}

export function trackVisualViewport(
  doc: Document,
  fn: (data: ViewportSize) => void,
): VoidFunction {
  const win = doc?.defaultView || window
  const onResize = () => {
    fn?.(getViewportSize(win))
  }
  onResize()
  return addDomEvent(win.visualViewport ?? win, "resize", onResize)
}

function getViewportSize(win: Window): ViewportSize {
  return {
    height: win.visualViewport?.height || win.innerHeight,
    width: win.visualViewport?.width || win.innerWidth,
  }
}
