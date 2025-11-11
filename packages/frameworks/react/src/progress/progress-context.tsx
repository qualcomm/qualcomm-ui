// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {ProgressApi} from "@qualcomm-ui/core/progress"
import {useProgressContext} from "@qualcomm-ui/react-core/progress"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface ProgressContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<ProgressApi>
}

/**
 * Provides access to the progress API via a render prop.
 */
export function ProgressContext({children}: ProgressContextProps): ReactNode {
  const context = useProgressContext()
  return renderProp(children, context)
}
