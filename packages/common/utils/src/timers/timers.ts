// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface RafIntervalOptions {
  deltaMs: number
  startMs: number
}

export function setRafInterval(
  callback: (options: RafIntervalOptions) => void,
  interval: number,
): () => void {
  let start = performance.now()
  let handle: number

  function loop(now: number) {
    handle = requestAnimationFrame(loop)
    const delta = now - start

    if (delta >= interval) {
      start = now - (delta % interval)
      callback({deltaMs: delta, startMs: start})
    }
  }

  handle = requestAnimationFrame(loop)
  return (): void => cancelAnimationFrame(handle)
}

export function setRafTimeout(callback: () => void, delay: number): () => void {
  const start = performance.now()
  let handle: number

  function loop(now: number) {
    const delta = now - start

    if (delta >= delay) {
      callback()
      return
    }

    handle = requestAnimationFrame(loop)
  }

  handle = requestAnimationFrame(loop)
  return () => cancelAnimationFrame(handle)
}
