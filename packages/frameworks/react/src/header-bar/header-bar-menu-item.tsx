// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronDown} from "lucide-react"

import {Icon, IconOrNode} from "@qualcomm-ui/react/icon"
import {useQdsMenuContext} from "@qualcomm-ui/react/menu"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {useMenuContext} from "@qualcomm-ui/react-core/menu"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsHeaderBarApi} from "./qds-header-bar-context"

export interface HeaderBarMenuItemProps extends ElementRenderProp<"button"> {
  /**
   * {@link https://lucide.dev lucide-react} icon. Can be supplied as a
   * `ReactElement` for additional customization.
   */
  icon?: LucideIconOrElement
}

export function HeaderBarMenuItem({
  children,
  icon,
  ...props
}: HeaderBarMenuItemProps): ReactElement {
  const menuContext = useMenuContext(false)
  const qdsMenuContext = useQdsMenuContext(false)

  if (!menuContext || !qdsMenuContext) {
    throw new Error("HeaderBar.MenuItem must be used within a Menu")
  }

  // className const conflicts with mergeProps type merging
  const mergedProps: any = mergeProps(
    qdsMenuContext.getButtonBindings(),
    qdsHeaderBarApi.getNavItemBindings(),
    props,
  )

  return (
    <button {...mergedProps}>
      {icon ? <IconOrNode icon={icon} /> : null}
      {children}
      <Icon data-part="end-icon" icon={ChevronDown} />
    </button>
  )
}
