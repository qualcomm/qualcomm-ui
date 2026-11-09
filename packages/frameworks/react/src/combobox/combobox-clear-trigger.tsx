// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {X} from "lucide-react"

import {
  CoreCombobox,
  type CoreComboboxClearTriggerProps,
} from "@qualcomm-ui/react-core/combobox"
import {IconButton} from "@qualcomm-ui/react/button"
import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ComboboxClearTriggerProps extends CoreComboboxClearTriggerProps {}

/**
 * Button that clears the input value. Renders a `<button>` element by default.
 */
export function ComboboxClearTrigger({
  render,
  ...props
}: ComboboxClearTriggerProps): ReactElement {
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(qdsContext.getClearTriggerBindings(), props)

  return (
    <CoreCombobox.ClearTrigger
      render={<IconButton density="compact" icon={X} render={render} variant="ghost" />}
      {...mergedProps}
    />
  )
}
