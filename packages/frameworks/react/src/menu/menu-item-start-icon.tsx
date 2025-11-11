// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuItemStartIconProps extends ElementRenderProp<"span"> {
  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   */
  children?: ReactNode

  /**
   * lucide-react icon or JSX Element.
   */
  icon: LucideIconOrElement
}

export function MenuItemStartIcon(props: MenuItemStartIconProps): ReactElement {
  const context = useQdsMenuContext()
  const mergedProps = mergeProps(context.getItemStartIconBindings(), {}, props)

  return <IconOrNode {...mergedProps} />
}
