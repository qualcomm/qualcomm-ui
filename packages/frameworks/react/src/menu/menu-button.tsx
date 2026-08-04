// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {ChevronDown} from "lucide-react"

import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {Icon} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context.js"

export interface MenuButtonProps extends Omit<ButtonProps, "endIcon"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function MenuButton({
  children,
  density,
  size,
  ...props
}: MenuButtonProps): ReactElement {
  const qdsMenuContext = useQdsMenuContext()
  const resolvedSize = size ?? qdsMenuContext.size

  const mergedProps = mergeProps(qdsMenuContext.getButtonBindings(), props)
  return (
    <Button {...mergedProps} density={density} size={resolvedSize}>
      {children}
      <Icon
        {...qdsMenuContext.getIndicatorBindings()}
        icon={ChevronDown}
        size={resolvedSize}
      />
    </Button>
  )
}
