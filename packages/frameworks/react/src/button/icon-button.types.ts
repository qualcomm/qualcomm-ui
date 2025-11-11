// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QdsIconButtonApiProps} from "@qualcomm-ui/qds-core/button"
import type {LucideIconOrElement} from "@qualcomm-ui/react-core/lucide"
import type {ElementRenderProp} from "@qualcomm-ui/react-core/system"

export interface IconButtonProps
  extends QdsIconButtonApiProps,
    ElementRenderProp<"button"> {
  /**
   * {@link https://lucide.dev lucide-react} icon. Can be supplied as a
   * `ReactElement` for additional customization.
   */
  icon: LucideIconOrElement
}
