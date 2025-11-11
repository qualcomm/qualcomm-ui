// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useEffect, useRef} from "react"

export function useTrack(deps: any[], effect: VoidFunction) {
  const render = useRef(false)
  const called = useRef(false)

  useEffect(() => {
    const mounted = render.current
    const run = mounted && called.current
    if (run) {
      return effect()
    }
    called.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps ?? []).map((d) => (typeof d === "function" ? d() : d))])

  useEffect(() => {
    render.current = true
    return () => {
      render.current = false
    }
  }, [])
}
