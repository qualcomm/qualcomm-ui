// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export function nextTick(fn: VoidFunction): VoidFunction {
  const set = new Set<VoidFunction>()
  function raf(fn: VoidFunction) {
    const id = globalThis.requestAnimationFrame(fn)
    set.add(() => globalThis.cancelAnimationFrame(id))
  }
  raf(() => raf(fn))
  return function cleanup() {
    set.forEach((fn) => fn())
  }
}

export function raf(fn: VoidFunction | (() => VoidFunction)): VoidFunction {
  let cleanup: VoidFunction | undefined | void
  const id = globalThis.requestAnimationFrame(() => {
    cleanup = fn()
  })
  return () => {
    globalThis.cancelAnimationFrame(id)
    cleanup?.()
  }
}

export function queueBeforeEvent(
  el: EventTarget,
  type: string,
  cb: () => void,
): VoidFunction {
  const cancelTimer = raf(() => {
    el.removeEventListener(type, exec, true)
    cb()
  })
  const exec = () => {
    cancelTimer()
    cb()
  }
  el.addEventListener(type, exec, {capture: true, once: true})
  return cancelTimer
}
