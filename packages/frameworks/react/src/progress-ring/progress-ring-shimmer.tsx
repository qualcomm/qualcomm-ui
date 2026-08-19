// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useQdsProgressRingContext} from "./qds-progress-ring-context.js"

export function ProgressRingShimmer(): ReactElement {
  const qdsContext = useQdsProgressRingContext()

  return <circle {...qdsContext.getShimmerBindings()} />
}
