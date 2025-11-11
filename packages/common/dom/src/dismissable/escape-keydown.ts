// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {addDomEvent, getDocument} from "@qualcomm-ui/dom/query"

export function trackEscapeKeydown(
  node: Document | HTMLElement,
  fn?: (event: KeyboardEvent) => void,
): VoidFunction {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape") {
      return
    }
    if (event.isComposing) {
      return
    }
    fn?.(event)
  }

  return addDomEvent(getDocument(node), "keydown", handleKeyDown, {
    capture: true,
  })
}
