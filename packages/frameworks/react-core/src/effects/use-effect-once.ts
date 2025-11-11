// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect} from "react"

export function useEffectOnce(fn: VoidFunction) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, [])
}
