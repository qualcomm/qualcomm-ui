// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsBreadcrumbsContext} from "./qds-breadcrumbs-context"

export interface BreadcrumbsItemIconProps
  extends Omit<ElementRenderProp<"span">, "children"> {
  /**
   * The icon or element to render before the item.
   */
  icon: LucideIconOrElement
}

export function BreadcrumbsItemIcon({
  icon,
  ...props
}: BreadcrumbsItemIconProps): ReactElement {
  const qdsContext = useQdsBreadcrumbsContext()
  const mergedProps = mergeProps(qdsContext.getItemIconBindings(), props)

  return <IconOrNode icon={icon} size={qdsContext.size} {...mergedProps} />
}
