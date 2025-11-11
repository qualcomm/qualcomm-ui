// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactElement} from "react"

import {ChevronDown} from "lucide-react"

import {IconButton, type IconButtonProps} from "@qualcomm-ui/react/button"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

import {useQdsMenuContext} from "./qds-menu-context"

export interface MenuIconButtonProps extends Omit<IconButtonProps, "icon"> {}

export function MenuIconButton(props: MenuIconButtonProps): ReactElement {
  const qdsMenuContext = useQdsMenuContext()
  const mergedProps = mergeProps(qdsMenuContext.getButtonBindings(), props)
  return <IconButton {...mergedProps} icon={ChevronDown} />
}
