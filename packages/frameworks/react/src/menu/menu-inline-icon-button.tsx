// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {
  InlineIconButton,
  type InlineIconButtonProps,
} from "@qualcomm-ui/react/inline-icon-button"

export interface MenuInlineIconButtonProps extends InlineIconButtonProps {}

export function MenuInlineIconButton(
  props: MenuInlineIconButtonProps,
): ReactElement {
  return <InlineIconButton {...props} />
}
