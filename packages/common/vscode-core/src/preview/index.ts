// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export interface VscodePreviewTheme {
  id: string
  label: string
}

/** Saved themes used by browser previews, independent of the installed VS Code host. */
export const vscodePreviewThemes: readonly VscodePreviewTheme[] = [
  {id: "dark-modern", label: "Dark Modern"},
  {id: "dark-plus", label: "Dark+"},
  {id: "dark-high-contrast", label: "Dark High Contrast"},
  {id: "light-modern", label: "Light Modern"},
  {id: "light-plus", label: "Light+"},
  {id: "light-high-contrast", label: "Light High Contrast"},
  {id: "monokai", label: "Monokai"},
  {id: "quiet-light", label: "Quiet Light"},
  {id: "solarized-dark", label: "Solarized Dark"},
  {id: "solarized-light", label: "Solarized Light"},
]
