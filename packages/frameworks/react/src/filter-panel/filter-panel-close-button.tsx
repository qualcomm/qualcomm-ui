// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsFilterPanelContext} from "./qds-filter-panel-context.js"

export interface FilterPanelCloseButtonProps extends Omit<
  IconButtonProps,
  "icon"
> {
  /**
   * {@link https://lucide.dev lucide-react} icon. Can be supplied as a
   * `ReactElement` for additional customization.
   *
   * @default X
   */
  icon?: IconButtonProps["icon"]
}

/**
 * Closes the filter panel. The panel does not manage its own visibility, so
 * handle `onClick` or render this inside a container that provides closing
 * behavior, such as a drawer. Renders a `<button>` element by default.
 */
export function FilterPanelCloseButton({
  icon = X,
  ...props
}: FilterPanelCloseButtonProps): ReactElement {
  const qdsContext = useQdsFilterPanelContext()

  const mergedProps = mergeProps(qdsContext.getCloseButtonBindings(), props)

  return <IconButton icon={icon} variant="outline" {...mergedProps} />
}
