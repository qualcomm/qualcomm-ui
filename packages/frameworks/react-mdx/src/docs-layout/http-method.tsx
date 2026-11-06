// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

/**
 * An HTTP method as colored monospace text, shared by the side nav and OpenAPI
 * pages. Inherits its font size from the surrounding text.
 */
export function HttpMethod({method}: {method: string}): ReactNode {
  return (
    <span className="qui-docs-http-method" data-method={method.toLowerCase()}>
      {method.toUpperCase()}
    </span>
  )
}
