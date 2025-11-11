// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {PopoverElementIds, PopoverTriggerBindings} from "@qualcomm-ui/core/popover"
import {Portal, type PortalProps} from "@qualcomm-ui/react-core/portal"
import {useControlledId} from "@qualcomm-ui/react-core/state"
import type {BindingRenderProp} from "@qualcomm-ui/react-core/system"

import {PopoverAnchor, type PopoverAnchorProps} from "./popover-anchor"
import {PopoverArrow, type PopoverArrowProps} from "./popover-arrow"
import {PopoverContent, type PopoverContentProps} from "./popover-content"
import {
  PopoverDescription,
  type PopoverDescriptionProps,
} from "./popover-description"
import {PopoverLabel, type PopoverLabelProps} from "./popover-label"
import {
  PopoverPositioner,
  type PopoverPositionerProps,
} from "./popover-positioner"
import {PopoverRoot, type PopoverRootProps} from "./popover-root"
import {PopoverTrigger} from "./popover-trigger"

export interface PopoverProps extends Omit<PopoverRootProps, "children"> {
  /**
   * Props applied to the anchor component.
   *
   * @inheritDoc
   */
  anchorProps?: PopoverAnchorProps

  /**
   * Props applied to the arrow component.
   *
   * @inheritDoc
   */
  arrowProps?: PopoverArrowProps

  /**
   * React {@link https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children children} prop.
   * The content body of the popover.
   */
  children?: ReactNode

  /**
   * Props applied to the content component.
   *
   * @inheritDoc
   */
  contentProps?: PopoverContentProps

  /**
   * Optional description text for the popover.
   */
  description?: ReactNode

  /**
   * Props applied to the description component.
   *
   * @inheritDoc
   */
  descriptionProps?: PopoverDescriptionProps

  /**
   * Whether to hide the arrow.
   * @default false
   */
  hideArrow?: boolean

  /**
   * Optional label text for the popover.
   */
  label?: ReactNode

  /**
   * Props applied to the label component.
   *
   * @inheritDoc
   */
  labelProps?: PopoverLabelProps

  /**
   * Props applied to the portal component.
   */
  portalProps?: PortalProps

  /**
   * Props applied to the positioner component.
   *
   * @inheritDoc
   */
  positionerProps?: PopoverPositionerProps

  /**
   * Render Prop. The popover trigger event handlers and attributes are applied to
   * this element. It must forward its {@link
   * https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop ref}
   *
   * @inheritDoc
   */
  trigger: BindingRenderProp<PopoverTriggerBindings>
}

export function Popover({
  anchorProps,
  arrowProps,
  children,
  contentProps,
  description,
  descriptionProps,
  hideArrow,
  label,
  labelProps,
  portalProps,
  positionerProps,
  trigger,
  ...props
}: PopoverProps): ReactElement {
  const labelContent = label || labelProps?.children
  const descriptionContent = description || descriptionProps?.children

  const ids: Partial<PopoverElementIds> = {
    anchor: useControlledId(anchorProps?.id),
    arrow: useControlledId(arrowProps?.id),
    content: useControlledId(contentProps?.id),
    description: descriptionContent ? descriptionProps?.id : "",
    positioner: useControlledId(positionerProps?.id),
    title: labelContent ? labelProps?.id : "",
    ...props.ids,
  }

  return (
    <PopoverRoot portalled={!portalProps?.disabled} {...props} ids={ids}>
      <PopoverAnchor {...anchorProps} id={ids.anchor}>
        <PopoverTrigger id={ids.trigger}>{trigger}</PopoverTrigger>
      </PopoverAnchor>

      <Portal {...portalProps}>
        <PopoverPositioner {...positionerProps} id={ids.positioner}>
          <PopoverContent {...contentProps} id={ids.content}>
            {!hideArrow ? (
              <PopoverArrow {...arrowProps} id={ids.arrow} />
            ) : null}

            {labelContent ? (
              <PopoverLabel {...labelProps} id={ids.title}>
                {labelContent}
              </PopoverLabel>
            ) : null}

            {descriptionContent ? (
              <PopoverDescription {...descriptionProps} id={ids.description}>
                {descriptionContent}
              </PopoverDescription>
            ) : null}
            {children}
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  )
}
