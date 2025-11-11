// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  type DialogBodyProps,
  useQdsDialogContext,
} from "@qualcomm-ui/react/dialog"
import {CoreDialog} from "@qualcomm-ui/react-core/dialog"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface DrawerBodyProps extends DialogBodyProps {}

/**
 * The main content of the drawer. Container for the heading, description,
 * indicator, and primary content of the dialog. Renders a `<div>` element by
 * default.
 */
export function DrawerBody(props: DrawerBodyProps): ReactElement {
  const qdsContext = useQdsDialogContext()
  const mergedProps = mergeProps(qdsContext.getBodyBindings(), props)

  return <CoreDialog.Body {...mergedProps} />
}
