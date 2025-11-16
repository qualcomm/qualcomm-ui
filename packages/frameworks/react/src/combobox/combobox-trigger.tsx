// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement, ReactNode} from "react"

import {ChevronDown, type LucideIcon} from "lucide-react"

import {InlineIconButton} from "@qualcomm-ui/react/inline-icon-button"
import {
  CoreCombobox,
  type CoreComboboxTriggerProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context"

export interface ComboboxTriggerProps extends CoreComboboxTriggerProps {
  /**
   * Dropdown visibility indicator icon. This automatically rotates when the
   * dropdown is visible.
   *
   * @default ChevronDown
   */
  icon?: ReactNode | LucideIcon
}

/**
 * Icon that indicates the open/close state of the combobox's associated panel.
 * Renders a `<button>` element by default.
 */
export function ComboboxTrigger({
  icon = ChevronDown,
  render,
  ...props
}: ComboboxTriggerProps): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getIndicatorBindings(), props)

  return (
    <CoreCombobox.Trigger
      render={
        <InlineIconButton
          icon={icon}
          render={render}
          size={qdsContext.size === "sm" ? "sm" : "md"}
          variant="scale"
        />
      }
      {...mergedProps}
    />
  )
}
