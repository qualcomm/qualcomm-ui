// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"

import {
  ListItemAccessory,
  type ListItemAccessoryProps,
} from "./list-item-accessory.js"
import {
  ListItemControl,
  type ListItemControlProps,
} from "./list-item-control.js"
import {
  ListItemDescription,
  type ListItemDescriptionProps,
} from "./list-item-description.js"
import {ListItemLabel, type ListItemLabelProps} from "./list-item-label.js"
import {ListItemRoot, type ListItemRootProps} from "./list-item-root.js"
import {
  ListItemStartIcon,
  type ListItemStartIconProps,
} from "./list-item-start-icon.js"

export interface ListItemProps extends Omit<ListItemRootProps, "children"> {
  /**
   * Content displayed at the end of the item.
   */
  accessory?: ReactNode

  /**
   * Props applied to the accessory element.
   *
   * @inheritDoc
   */
  accessoryProps?: ListItemAccessoryProps

  /**
   * The simple ListItem doesn't support children. Use {@link label} or the
   * compound API instead.
   */
  children?: never

  /**
   * A leading control, such as a checkbox or radio button.
   */
  control?: ReactNode

  /**
   * Props applied to the control element.
   *
   * @inheritDoc
   */
  controlProps?: ListItemControlProps

  /**
   * Supplementary text displayed below the label.
   */
  description?: ReactNode

  /**
   * Props applied to the description element.
   *
   * @inheritDoc
   */
  descriptionProps?: ListItemDescriptionProps

  /**
   * The primary text of the item.
   */
  label?: ReactNode

  /**
   * Props applied to the label element.
   *
   * @inheritDoc
   */
  labelProps?: ListItemLabelProps

  /**
   * An icon displayed before the item's text.
   */
  startIcon?: LucideIconOrElement

  /**
   * Props applied to the start icon element.
   *
   * @inheritDoc
   */
  startIconProps?: Omit<ListItemStartIconProps, "icon">
}

/**
 * A list item assembled from the common label, description, icon, control, and
 * accessory parts. Renders an `<li>` element by default.
 *
 * @alpha
 */
export function ListItem({
  accessory,
  accessoryProps,
  control,
  controlProps,
  description,
  descriptionProps,
  label,
  labelProps,
  startIcon,
  startIconProps,
  ...props
}: ListItemProps): ReactElement {
  const accessoryContent = accessory || accessoryProps?.children
  const controlContent = control || controlProps?.children
  const descriptionContent = description || descriptionProps?.children
  const labelContent = label || labelProps?.children

  return (
    <ListItemRoot {...props}>
      {controlContent ? (
        <ListItemControl {...controlProps}>{controlContent}</ListItemControl>
      ) : null}
      {startIcon ? (
        <ListItemStartIcon {...startIconProps} icon={startIcon} />
      ) : null}
      {labelContent ? (
        <ListItemLabel {...labelProps}>{labelContent}</ListItemLabel>
      ) : null}
      {descriptionContent ? (
        <ListItemDescription {...descriptionProps}>
          {descriptionContent}
        </ListItemDescription>
      ) : null}
      {accessoryContent ? (
        <ListItemAccessory {...accessoryProps}>
          {accessoryContent}
        </ListItemAccessory>
      ) : null}
    </ListItemRoot>
  )
}
