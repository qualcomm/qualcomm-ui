// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {Dialog, type DialogHeadingProps} from "@qualcomm-ui/react/dialog"

export interface DrawerHeadingProps extends DialogHeadingProps {}

export function DrawerHeading(props: DrawerHeadingProps): ReactElement {
  return <Dialog.Heading {...props} />
}
