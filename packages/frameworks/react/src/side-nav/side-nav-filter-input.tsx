// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Search} from "lucide-react"

import {TextInput, type TextInputProps} from "@qualcomm-ui/react/text-input"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {qdsSideNavApi} from "./qds-side-nav-context"

export interface SideNavFilterInputProps extends TextInputProps {}

export function SideNavFilterInput({
  "aria-label": ariaLabel = "Search",
  placeholder = "Search",
  startIcon = Search,
  ...props
}: SideNavFilterInputProps): ReactElement {
  const mergedProps = mergeProps(qdsSideNavApi.getFilterInputBindings(), props)

  return (
    <TextInput
      aria-label={ariaLabel}
      placeholder={placeholder}
      size="sm"
      startIcon={startIcon}
      {...mergedProps}
    />
  )
}
