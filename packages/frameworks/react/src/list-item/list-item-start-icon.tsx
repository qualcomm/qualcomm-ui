// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"
import {IconOrNode} from "@qualcomm-ui/react/icon"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsListItemContext} from "./qds-list-item-context.js"

export interface ListItemStartIconProps extends Omit<
  ElementRenderProp<"span">,
  "children"
> {
  /**
   * The icon displayed before the item's text.
   */
  icon: LucideIconOrElement
}

/**
 * An icon displayed before the text of a list item. Renders a `<span>` element
 * by default when the icon is a React element.
 */
export function ListItemStartIcon({
  icon,
  ...props
}: ListItemStartIconProps): ReactElement {
  const qdsContext = useQdsListItemContext()
  const mergedProps = mergeProps(qdsContext.getStartIconBindings(), props)

  return <IconOrNode icon={icon} size={qdsContext.size} {...mergedProps} />
}
