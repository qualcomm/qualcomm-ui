// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {addDomEvent} from "./event.js"

export function requestPointerLock(
  doc: Document,
  fn?: (locked: boolean) => void,
): VoidFunction | undefined {
  const body = doc.body

  const supported =
    "pointerLockElement" in doc || "mozPointerLockElement" in doc
  const isLocked = () => !!doc.pointerLockElement

  function onPointerChange() {
    fn?.(isLocked())
  }

  function onPointerError(event: Event) {
    if (isLocked()) {
      fn?.(false)
    }
    console.error("PointerLock error occurred:", event)
    doc.exitPointerLock()
  }

  if (!supported) {
    return
  }

  try {
    body.requestPointerLock()
  } catch {}

  // prettier-ignore
  const cleanup = [
    addDomEvent(doc, "pointerlockchange", onPointerChange, false),
    addDomEvent(doc, "pointerlockerror", onPointerError, false)
  ]

  return () => {
    for (const cleanup1 of cleanup) {
      cleanup1()
    }
    doc.exitPointerLock()
  }
}
