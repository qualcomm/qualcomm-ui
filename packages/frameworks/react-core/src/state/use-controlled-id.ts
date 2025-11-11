// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {useId} from "react"

/**
 * Returns the provided id. If the id is omitted, returns a unique identifier as a
 * fallback. This is often used by components that need a unique identifier for an
 * element (like inputs for accessibility). If the user supplies an ID, we account
 * for that. Otherwise, a unique identifier is created.
 */
export function useControlledId(override?: string): string {
  const id = useId()

  return override || id
}
