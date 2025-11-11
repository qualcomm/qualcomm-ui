// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InputStartIcon, useQdsInputContext} from "@qualcomm-ui/react/input"
import {
  CoreCombobox,
  type CoreComboboxControlProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ComboboxControlProps extends CoreComboboxControlProps {}

/**
 * Container for the input element and associated controls. Renders a `<div>` element
 * by default.
 */
export function ComboboxControl({
  children,
  ...props
}: ComboboxControlProps): ReactElement {
  const qdsContext = useQdsInputContext()
  const mergedProps = mergeProps(qdsContext.getGroupBindings(), props)

  return (
    <CoreCombobox.Control {...mergedProps}>
      {qdsContext.startIcon ? (
        <InputStartIcon icon={qdsContext.startIcon} />
      ) : null}
      {children}
    </CoreCombobox.Control>
  )
}
