// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {type ReactElement, useMemo} from "react"

import {createQdsToastApi} from "@qualcomm-ui/qds-core/toast"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {
  CoreToast,
  type CoreToastRootProps,
  useToastContext,
} from "@qualcomm-ui/react-core/toast"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {QdsToastContextProvider} from "./qds-toast-context"

export interface ToastRootProps extends CoreToastRootProps {}

export function ToastRoot(props: ToastRootProps): ReactElement {
  const toastContext = useToastContext()
  const qdsApi = useMemo(
    () => createQdsToastApi({emphasis: toastContext.type}, normalizeProps),
    [toastContext.type],
  )

  const mergedProps = mergeProps(qdsApi.getRootBindings(), props)

  return (
    <QdsToastContextProvider value={qdsApi}>
      <CoreToast.Root {...mergedProps} />
    </QdsToastContextProvider>
  )
}
