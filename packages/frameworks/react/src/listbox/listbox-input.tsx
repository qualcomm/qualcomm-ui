// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {useListboxContext} from "@qualcomm-ui/react-core/listbox"
import {type TextInputProps, TextInput} from "@qualcomm-ui/react/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsListboxContext} from "./qds-listbox-context.js"

export interface ListboxInputProps extends TextInputProps {}

export function ListboxInput(props: ListboxInputProps): ReactElement {
  const listboxContext = useListboxContext()
  const qdsContext = useQdsListboxContext()
  const mergedProps = mergeProps(
    {
      inputProps: {
        ...listboxContext.getInputBindings({}),
      },
      size: qdsContext.size,
    } satisfies TextInputProps,
    props,
  )
  return <TextInput {...mergedProps} />
}
