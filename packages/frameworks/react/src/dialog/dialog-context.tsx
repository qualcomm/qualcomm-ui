// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {DialogApi} from "@qualcomm-ui/core/dialog"
import {useDialogContext} from "@qualcomm-ui/react-core/dialog"
import {type RenderProp, renderProp} from "@qualcomm-ui/react-core/system"

export interface DialogContextProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children: RenderProp<DialogApi>
}

export function DialogContext({children}: DialogContextProps): ReactNode {
  const context = useDialogContext()
  return renderProp(children, context)
}
