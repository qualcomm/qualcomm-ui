// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {isValidElement, type ReactElement} from "react"

import {Icon, IconOrNode} from "@qualcomm-ui/react/icon"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import {CoreTabs, type CoreTabsTabButtonProps} from "@qualcomm-ui/react-core/tabs"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsTabsContext} from "../qds-tabs-context"

export interface TabButtonProps extends CoreTabsTabButtonProps {
  /**
   * Use the `disabled` prop on the parent `<Tab.Root>` component instead.
   */
  disabled?: never

  /**
   * Icon positioned after the text content.  If supplied as a
   * `LucideIcon`, the size will automatically match the {@link size} prop.
   * Supply as a `ReactElement` for additional customization.
   */
  endIcon?: LucideIconOrElement

  /**
   * Icon positioned before the text content.  If supplied as a `LucideIcon`,
   * the size will automatically match the {@link size}. Supply as a
   * `ReactElement` for additional customization.
   */
  startIcon?: LucideIconOrElement
}

/**
 * Button that activates its associated tab panel. Renders a `<button>` element by
 * default.
 */
export function TabButton({
  children,
  endIcon,
  startIcon,
  ...props
}: TabButtonProps): ReactElement {
  const qdsContext = useQdsTabsContext()
  const mergedProps = mergeProps(qdsContext.getTabButtonBindings(), props)

  return (
    <CoreTabs.TabButton {...mergedProps}>
      {startIcon ? (
        isValidElement(startIcon) ? (
          <IconOrNode
            icon={startIcon}
            {...qdsContext.getTabStartIconBindings()}
          />
        ) : (
          <span {...qdsContext.getTabStartIconBindings()}>
            <Icon icon={startIcon} />
          </span>
        )
      ) : null}
      {children}
      {endIcon ? (
        isValidElement(endIcon) ? (
          <IconOrNode icon={endIcon} {...qdsContext.getTabEndIconBindings()} />
        ) : (
          <span {...qdsContext.getTabEndIconBindings()}>
            <Icon icon={endIcon} />
          </span>
        )
      ) : null}
    </CoreTabs.TabButton>
  )
}
