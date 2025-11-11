// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

export type QdsAccordionSize = "sm" | "md" | "lg"

export interface QdsAccordionApiProps {
  /**
   * The size of the accordion.
   */
  size?: QdsAccordionSize

  /**
   * To display the accordion uncontained to the edges of its container.
   */
  uncontained?: boolean
}

export interface QdsAccordionProps {
  "data-size": QdsAccordionSize
  "data-uncontained": BooleanDataAttr
}
