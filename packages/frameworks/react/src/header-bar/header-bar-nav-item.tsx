// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {QdsHeaderBarNavItemProps} from "@qualcomm-ui/qds-core/header-bar"
import type {ButtonProps} from "@qualcomm-ui/react/button"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsHeaderBarApi} from "./qds-header-bar-context"

export interface HeaderBarNavItemProps
  extends ElementRenderProp<"button">,
    QdsHeaderBarNavItemProps,
    Pick<ButtonProps, "endIcon" | "startIcon"> {}

export function HeaderBarNavItem({
  active,
  children,
  endIcon,
  startIcon,
  ...props
}: HeaderBarNavItemProps): ReactElement {
  const mergedProps = mergeProps(
    qdsHeaderBarApi.getNavItemBindings({active}),
    props,
  )

  return (
    <PolymorphicElement as="button" {...mergedProps}>
      {startIcon ? <IconOrNode icon={startIcon} /> : null}
      {children}
      {endIcon ? <IconOrNode icon={endIcon} /> : null}
    </PolymorphicElement>
  )
}
