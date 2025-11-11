// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {BasicThemeData} from "./theme.types"

export const themeZIndex: BasicThemeData[] = [
  {tailwind: "z-modal-backdrop", variable: "--q-zindex-modal-backdrop"},
  {tailwind: "z-dropdown", variable: "--q-zindex-dropdown"},
  {tailwind: "z-dropdown-arrow", variable: "--q-zindex-dropdown-arrow"},
  {tailwind: "z-sticky", variable: "--q-zindex-sticky"},
  {tailwind: "z-modal", variable: "--q-zindex-modal"},
  {tailwind: "z-popover", variable: "--q-zindex-popover"},
  {tailwind: "z-tooltip", variable: "--q-zindex-tooltip"},
  {tailwind: "z-toast", variable: "--q-zindex-toast"},
  {tailwind: "z-alert-banner", variable: "--q-zindex-alert-banner"},
]
