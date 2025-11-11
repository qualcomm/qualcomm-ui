// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {InputLabel} from "@qualcomm-ui/react/input"
import {
  CoreCombobox,
  type CoreComboboxLabelProps,
  useComboboxContext,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context"

export interface ComboboxLabelProps extends CoreComboboxLabelProps {}

/**
 * Label text associated with the combobox. Renders a `<label>` element by default.
 */
export function ComboboxLabel({
  render,
  ...props
}: ComboboxLabelProps): ReactElement {
  const comboboxContext = useComboboxContext()
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return (
    <CoreCombobox.Label
      render={
        <InputLabel render={render} required={comboboxContext.required} />
      }
      {...mergedProps}
    />
  )
}
