// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {TooltipApiProps} from "@qualcomm-ui/core/tooltip"
import {TooltipContextProvider, useTooltip} from "@qualcomm-ui/react-core/tooltip"

export interface TooltipRootProps extends TooltipApiProps {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

/**
 * The main component that wraps the trigger and the content elements. Doesn't
 * render anything by itself.
 */
export function TooltipRoot({children, ...props}: TooltipRootProps) {
  return (
    <TooltipContextProvider value={useTooltip(props)}>
      {children}
    </TooltipContextProvider>
  )
}
