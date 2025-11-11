// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {SyntheticEvent} from "react"

/**
 * Callback fired when panel visibility changes.
 *
 * @param isOpen The updated state. If `true`, the panel is visible.
 * @param event the DOM event that triggered the change.
 */
export type OnControlledOpenChange = (
  isOpen: boolean,
  event?: SyntheticEvent,
) => void

export interface ControlledOpen {
  /**
   * The default value when uncontrolled.
   */
  defaultOpen?: boolean

  /**
   * Callback fired when panel visibility changes.
   */
  onOpenChange?: OnControlledOpenChange

  /**
   * The controlled state for the component's visibility.
   */
  open?: boolean
}
