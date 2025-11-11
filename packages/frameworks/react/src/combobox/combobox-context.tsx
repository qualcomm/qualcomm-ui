// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {ComboboxApi} from "@qualcomm-ui/core/combobox"
import {useComboboxContext} from "@qualcomm-ui/react-core/combobox"
import {renderProp, type RenderProp} from "@qualcomm-ui/react-core/system"

export interface ComboboxContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<ComboboxApi>
}

export function ComboboxContext({children}: ComboboxContextProps): ReactNode {
  const context = useComboboxContext()
  return renderProp(children, context)
}
