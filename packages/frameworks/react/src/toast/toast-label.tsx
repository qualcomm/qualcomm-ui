// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreToast, type CoreToastLabelProps} from "@qualcomm-ui/react-core/toast"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsToastContext} from "./qds-toast-context"

export interface ToastLabelProps extends CoreToastLabelProps {}

export function ToastLabel(props: ToastLabelProps): ReactElement {
  const qdsContext = useQdsToastContext()
  const mergedProps = mergeProps(qdsContext.getLabelBindings(), props)

  return <CoreToast.Label {...mergedProps} />
}
