// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode} from "react"

import type {
  QdsButtonApiProps,
  QdsButtonGroupApiProps,
} from "@qualcomm-ui/qds-core/button"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"

export interface ButtonProps
  extends QdsButtonApiProps, ElementRenderProp<"button"> {
  /**
   * A `NumberBadge` or `StatusBadge`, positioned after the text content. Its
   * emphasis, size, and disabled state default to values that match the button.
   * Props set on the badge take precedence.
   *
   * @since next-release
   */
  badge?: ReactNode

  /**
   * Icon positioned after the text content.  If supplied as a
   * `LucideIcon`, the size will automatically match the {@link size} prop.
   * Supply as a `ReactElement` for additional customization.
   */
  endIcon?: LucideIconOrElement | null

  /**
   * Icon positioned before the text content.  If supplied as a `LucideIcon`,
   * the size will automatically match the {@link size} prop. Supply as a
   * `ReactElement` for additional customization.
   */
  startIcon?: LucideIconOrElement | null
}

export interface ButtonGroupProps
  extends ElementRenderProp<"div">, QdsButtonGroupApiProps {}
