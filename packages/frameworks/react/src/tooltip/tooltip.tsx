// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {TooltipTriggerBindings} from "@qualcomm-ui/core/tooltip"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import type {BindingRenderProp} from "@qualcomm-ui/react-core/system"

import {TooltipArrow, type TooltipArrowProps} from "./tooltip-arrow"
import {TooltipArrowTip, type TooltipArrowTipProps} from "./tooltip-arrow-tip"
import {TooltipContent, type TooltipContentProps} from "./tooltip-content"
import {
  TooltipPositioner,
  type TooltipPositionerProps,
} from "./tooltip-positioner"
import {TooltipRoot, type TooltipRootProps} from "./tooltip-root"
import {TooltipTrigger} from "./tooltip-trigger"

export interface TooltipProps extends Omit<TooltipRootProps, "children"> {
  /**
   * Props applied to the arrow element.
   *
   * @inheritDoc
   */
  arrowProps?: TooltipArrowProps

  /**
   * Props applied to the arrow tip element.
   *
   * @inheritDoc
   */
  arrowTipProps?: TooltipArrowTipProps

  /**
   * The text content of the tooltip.
   */
  children?: ReactNode

  /**
   * Props applied to the content element.
   *
   * @inheritDoc
   */
  contentProps?: TooltipContentProps

  /**
   * Whether to hide the arrow.
   *
   * @default false
   */
  hideArrow?: boolean

  /**
   * Props applied to the portal element.
   *
   * @inheritDoc
   */
  portalProps?: PortalProps

  /**
   * Props applied to the positioner element.
   *
   * @inheritDoc
   */
  positionerProps?: TooltipPositionerProps

  /**
   * React children render prop. The tooltip trigger event handlers and attributes
   * are applied to this element. It must forward its
   * {@link https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop ref}
   *
   * @inheritDoc
   */
  trigger: BindingRenderProp<TooltipTriggerBindings>
}

export function Tooltip({
  arrowProps,
  arrowTipProps,
  children,
  contentProps,
  hideArrow,
  portalProps,
  positionerProps,
  trigger,
  ...props
}: TooltipProps): ReactElement {
  return (
    <TooltipRoot {...props}>
      <TooltipTrigger>{trigger}</TooltipTrigger>
      <Portal {...portalProps}>
        <TooltipPositioner {...positionerProps}>
          <TooltipContent {...contentProps}>
            {hideArrow ? null : (
              <TooltipArrow {...arrowProps}>
                <TooltipArrowTip {...arrowTipProps} />
              </TooltipArrow>
            )}
            {children}
          </TooltipContent>
        </TooltipPositioner>
      </Portal>
    </TooltipRoot>
  )
}
