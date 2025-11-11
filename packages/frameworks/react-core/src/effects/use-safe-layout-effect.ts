// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  type DependencyList,
  type EffectCallback,
  useEffect,
  useLayoutEffect,
} from "react"

export const useSafeLayoutEffect: (
  effect: EffectCallback,
  deps?: DependencyList,
) => void = typeof document !== "undefined" ? useLayoutEffect : useEffect
