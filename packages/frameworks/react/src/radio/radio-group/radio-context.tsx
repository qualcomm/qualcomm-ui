// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {RadioApi} from "@qualcomm-ui/core/radio"
import {useRadioContext} from "@qualcomm-ui/react-core/radio"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface RadioContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<RadioApi>
}

export function RadioContext({children}: RadioContextProps): ReactNode {
  const context = useRadioContext()
  return renderProp(children, context)
}
