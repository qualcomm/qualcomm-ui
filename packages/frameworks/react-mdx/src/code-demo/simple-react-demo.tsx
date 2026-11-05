// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

export interface SimpleReactDemoProps {
  /**
   * The demo's rendered example.
   */
  component: ReactNode

  /**
   * Source code, expected to be syntax highlighted already.
   */
  sourceCode: ReactNode
}

/**
 * A simple, single-tab demo component that renders a component with one snippet of
 * source code. The source code is always visible.
 */
export function SimpleReactDemo({
  component,
  sourceCode,
}: SimpleReactDemoProps): ReactElement {
  return (
    <div className="qui-docs-demo-container__root">
      <div className="qui-demo-runner__wrapper">{component}</div>
      <div className="qui-demo-runner__tabs">{sourceCode}</div>
    </div>
  )
}
