// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {QdsButtonApiProps} from "@qualcomm-ui/qds-core/button"
import {
  getQdsSplitButtonBindings,
  type QdsSplitButtonApiProps,
} from "@qualcomm-ui/qds-core/menu"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  type ElementRenderProp,
  PolymorphicElement,
} from "@qualcomm-ui/react-core/system"
import {Button, type ButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {MenuIconButton, type MenuIconButtonProps} from "./menu-icon-button.js"
import {MenuTrigger} from "./menu-trigger.js"

/**
 * @since 1.24.0
 */
export interface MenuSplitButtonProps
  extends Omit<ElementRenderProp<"div">, "onClick">, QdsSplitButtonApiProps {
  /**
   * Props applied to the primary action button.
   */
  actionProps?: Omit<ButtonProps, keyof QdsButtonApiProps | "children">

  /**
   * Content rendered inside the primary action button.
   */
  children?: ReactNode

  /**
   * Icon positioned after the primary action label.
   */
  endIcon?: ButtonProps["endIcon"]

  /**
   * Called when the primary action button is clicked.
   */
  onClick?: ButtonProps["onClick"]

  /**
   * Icon positioned before the primary action label.
   */
  startIcon?: ButtonProps["startIcon"]

  /**
   * Props applied to the chevron trigger button.
   */
  triggerProps?: Omit<MenuIconButtonProps, keyof QdsButtonApiProps>
}

/**
 * @since 1.24.0
 */
export function MenuSplitButton({
  actionProps,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  children,
  density,
  disabled,
  emphasis,
  endIcon,
  onClick,
  size,
  startIcon,
  triggerProps,
  variant,
  ...props
}: MenuSplitButtonProps): ReactElement {
  const buttonProps = {density, disabled, emphasis, size, variant}
  const mergedProps = mergeProps(
    getQdsSplitButtonBindings(
      {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...buttonProps,
      },
      normalizeProps,
    ),
    props,
  )
  return (
    <PolymorphicElement as="div" {...mergedProps}>
      <Button
        {...buttonProps}
        {...actionProps}
        endIcon={endIcon ?? actionProps?.endIcon}
        onClick={onClick ?? actionProps?.onClick}
        startIcon={startIcon ?? actionProps?.startIcon}
      >
        {children}
      </Button>
      <MenuTrigger>
        <MenuIconButton
          aria-label="More options"
          {...buttonProps}
          {...triggerProps}
        />
      </MenuTrigger>
    </PolymorphicElement>
  )
}
