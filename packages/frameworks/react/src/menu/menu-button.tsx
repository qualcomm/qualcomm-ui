// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {ChevronDown} from "lucide-react"

import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuButtonProps extends Omit<ButtonProps, "endIcon"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode
}

export function MenuButton(props: MenuButtonProps): ReactElement {
  const qdsMenuContext = useQdsMenuContext()
  const mergedProps = mergeProps(qdsMenuContext.getButtonBindings(), props)
  return <Button {...mergedProps} endIcon={ChevronDown} />
}
