// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  CoreListbox,
  type CoreListboxContentProps,
} from "@qualcomm-ui/react-core/listbox"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsListboxContext} from "./qds-listbox-context.js"

export interface ListboxContentProps extends CoreListboxContentProps {}

/**
 * Container for the listbox options. Renders a `<div>` element by default.
 */
export function ListboxContent(props: ListboxContentProps): ReactElement {
  const qdsContext = useQdsListboxContext()
  const mergedProps = mergeProps(qdsContext.getContentBindings(), props)

  return <CoreListbox.Content {...mergedProps} />
}
