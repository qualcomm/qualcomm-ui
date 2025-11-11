// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useQdsInputContext} from "@qualcomm-ui/react/input"
import {
  CoreCombobox,
  type CoreComboboxInputProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface ComboboxInputProps extends CoreComboboxInputProps {}

/**
 * Text input element for filtering and selecting items. Renders an `<input>` element
 * by default.
 */
export function ComboboxInput(props: ComboboxInputProps): ReactElement {
  const qdsContext = useQdsInputContext()

  const mergedProps = mergeProps(qdsContext.getInputBindings(), props)

  return <CoreCombobox.Input {...mergedProps} />
}
