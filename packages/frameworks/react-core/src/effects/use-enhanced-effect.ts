// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useLayoutEffect} from "react"

/**
 * @deprecated - migrate to `useSafeLayoutEffect`
 */
export const useEnhancedEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect
