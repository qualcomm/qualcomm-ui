// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

export interface HeaderBarActionIconButtonProps
  extends ElementRenderProp<"button">,
    Pick<IconButtonProps, "icon"> {}

export function HeaderBarActionIconButton({
  icon,
  render,
  ...props
}: HeaderBarActionIconButtonProps): ReactElement {
  return (
    <PolymorphicElement
      render={
        <IconButton
          density="compact"
          icon={icon}
          render={render}
          size="lg"
          variant="ghost"
        />
      }
      {...props}
    />
  )
}
