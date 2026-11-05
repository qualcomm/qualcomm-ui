// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Calendar} from "lucide-react"

import {IconOrNode} from "@qualcomm-ui/react/icon"

import {useQdsDatePickerContext} from "./qds-date-picker-context.js"

/**
 * Non-interactive calendar icon shown inside {@link DatePickerInputGroup} when
 * the field itself acts as the calendar trigger.
 */
export function DatePickerInputIcon(): ReactElement {
  const qdsContext = useQdsDatePickerContext()

  return (
    <IconOrNode
      aria-hidden
      icon={Calendar}
      {...qdsContext.getInputIconBindings()}
    />
  )
}
