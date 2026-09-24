// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreListbox,
  type CoreListboxLabelProps,
} from "@qualcomm-ui/react-core/listbox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsListboxContext} from "./qds-listbox-context.js"

export interface ListboxLabelProps extends CoreListboxLabelProps {}

/**
 * Accessible label for the listbox. Renders a `<div>` element by default.
 */
export function ListboxLabel(props: ListboxLabelProps): ReactElement {
  const qdsContext = useQdsListboxContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return <CoreListbox.Label {...mergedProps} />
}
