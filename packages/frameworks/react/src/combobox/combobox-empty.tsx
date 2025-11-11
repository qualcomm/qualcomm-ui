// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxEmptyProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context"

export interface ComboboxEmptyProps extends CoreComboboxEmptyProps {}

/**
 * Message displayed when no options match the filter. Renders a `<div>` element by
 * default.
 */
export function ComboboxEmpty(props: ComboboxEmptyProps): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getItemBindings(), props)

  return <CoreCombobox.Empty {...mergedProps} />
}
