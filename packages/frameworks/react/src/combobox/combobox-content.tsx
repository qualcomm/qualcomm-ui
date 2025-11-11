// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreCombobox,
  type CoreComboboxContentProps,
} from "@qualcomm-ui/react-core/combobox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsComboboxContext} from "./qds-combobox-context"

export interface ComboboxContentProps extends CoreComboboxContentProps {}

/**
 * Container for the combobox options. Renders a `<div>` element by default.
 */
export function ComboboxContent(props: ComboboxContentProps): ReactElement {
  const qdsContext = useQdsComboboxContext()
  const mergedProps = mergeProps(qdsContext.getContentBindings(), props)

  return <CoreCombobox.Content {...mergedProps} />
}
