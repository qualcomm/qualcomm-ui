// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isFirefox} from "./platform"
import {queueBeforeEvent} from "./raf"

export function clickIfLink(el: HTMLAnchorElement): void {
  const click = () => el.click()
  if (isFirefox()) {
    queueBeforeEvent(el, "keyup", click)
  } else {
    queueMicrotask(click)
  }
}
