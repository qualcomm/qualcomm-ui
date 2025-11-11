// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {CoreToast, type CoreToastDescriptionProps} from "@qualcomm-ui/react-core/toast"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsToastContext} from "./qds-toast-context"

export interface ToastDescriptionProps extends CoreToastDescriptionProps {}

export function ToastDescription(props: ToastDescriptionProps): ReactElement {
  const qdsContext = useQdsToastContext()
  const mergedProps = mergeProps(qdsContext.getDescriptionBindings(), props)

  return <CoreToast.Description {...mergedProps} />
}
