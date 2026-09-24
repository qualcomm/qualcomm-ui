// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {
  createQdsListboxApi,
  type QdsListboxApiProps,
} from "@qualcomm-ui/qds-core/listbox"
import {
  CoreListbox,
  type CoreListboxRootProps,
} from "@qualcomm-ui/react-core/listbox"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import type {CollectionItem} from "@qualcomm-ui/utils/collection"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsListboxContextProvider} from "./qds-listbox-context.js"

export interface ListboxRootProps<T extends CollectionItem = CollectionItem>
  extends CoreListboxRootProps<T>, QdsListboxApiProps {}

/**
 * Groups all parts of the listbox. Renders a `<div>` element by default.
 */
export function ListboxRoot<T extends CollectionItem = CollectionItem>({
  size,
  ...props
}: ListboxRootProps<T>): ReactElement {
  const qdsContext = useMemo(
    () => createQdsListboxApi({size}, normalizeProps),
    [size],
  )
  const mergedProps = mergeProps(qdsContext.getRootBindings(), props)

  return (
    <QdsListboxContextProvider value={qdsContext}>
      <CoreListbox.Root {...mergedProps} />
    </QdsListboxContextProvider>
  )
}
