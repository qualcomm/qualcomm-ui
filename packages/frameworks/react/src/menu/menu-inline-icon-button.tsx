// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"

export interface MenuInlineIconButtonProps extends IconButtonProps {}

export function MenuInlineIconButton(
  props: MenuInlineIconButtonProps,
): ReactElement {
  return <IconButton density="compact" variant="ghost" {...props} />
}
