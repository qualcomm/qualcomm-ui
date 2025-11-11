// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {CheckboxApi} from "@qualcomm-ui/core/checkbox"
import {useCheckboxContext} from "@qualcomm-ui/react-core/checkbox"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface CheckboxContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<CheckboxApi>
}

export function CheckboxContext({children}: CheckboxContextProps): ReactNode {
  const context = useCheckboxContext()
  return renderProp(children, context)
}
