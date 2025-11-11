// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentPropsWithRef} from "react"

import type {LucideIcon} from "lucide-react"

import {getQdsIconBindings, type QdsIconSize} from "@qualcomm-ui/qds-core/icon"
import {normalizeProps} from "@qualcomm-ui/react-core/machine"
import {mergeProps} from "@qualcomm-ui/utils/merge-props"

export interface IconProps extends ComponentPropsWithRef<"svg"> {
  /**
   * lucide-react icon.
   */
  icon: LucideIcon

  /**
   * The size of the icon. If supplied as a number, the value will be applied as
   * px. Otherwise, the string value of the property will apply.
   *
   * @default 'md'
   */
  size?: QdsIconSize
}

/**
 * Renders a lucide-react icon `<svg>` element.
 */
export function Icon({icon: IconEl, size, ...props}: IconProps) {
  const qdsProps = getQdsIconBindings({size, ...props}, normalizeProps)
  const mergedProps = mergeProps(qdsProps, props)

  return <IconEl height={undefined} width={undefined} {...mergedProps} />
}
