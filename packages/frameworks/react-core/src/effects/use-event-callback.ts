// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useCallback, useRef} from "react"

import {useSafeLayoutEffect} from "./use-safe-layout-effect"

/**
 * Inspired by https://github.com/facebook/react/issues/14099#issuecomment-440013892
 * See RFC in https://github.com/reactjs/rfcs/pull/220
 * Also see: https://dev.to/haseeb1009/the-useevent-hook-1c8l
 */
export function useEventCallback<
  Fn extends (...args: any[]) => any = (...args: unknown[]) => unknown,
>(fn: Fn): Fn
export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): (...args: Args) => Return
export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): (...args: Args) => Return {
  const ref = useRef(fn)
  useSafeLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback((...args: Args) => (0, ref.current)(...args), [])
}
