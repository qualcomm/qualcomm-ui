// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"

export interface HeaderBarActionButtonProps
  extends ElementRenderProp<"button">,
    Pick<ButtonProps, "startIcon" | "endIcon"> {}

export function HeaderBarActionButton({
  endIcon,
  render,
  startIcon,
  ...props
}: HeaderBarActionButtonProps): ReactElement {
  return (
    <PolymorphicElement
      render={
        <Button
          density="compact"
          endIcon={endIcon}
          render={render}
          size="lg"
          startIcon={startIcon}
          variant="ghost"
        />
      }
      {...props}
    />
  )
}
