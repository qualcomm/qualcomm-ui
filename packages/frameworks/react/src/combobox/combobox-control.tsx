// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxControlProps,
} from "@qualcomm-ui/react-core/combobox"
import {InputStartIcon, useQdsInputContext} from "@qualcomm-ui/react/input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context.js"

export interface ComboboxControlProps extends CoreComboboxControlProps {}

/**
 * Container for the input element and associated controls. Renders a `<div>` element
 * by default.
 */
export function ComboboxControl({
  children,
  ...props
}: ComboboxControlProps): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const qdsInputContext = useQdsInputContext()
  const mergedProps = mergeProps(qdsContext.getControlBindings(), props)

  return (
    <CoreCombobox.Control {...mergedProps}>
      {qdsInputContext.startIcon ? (
        <InputStartIcon icon={qdsInputContext.startIcon} />
      ) : null}
      {children}
    </CoreCombobox.Control>
  )
}
