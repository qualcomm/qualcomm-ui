// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createImportModEntries} from "../mod-imports"
import type {ImportTransformEntry} from "../transformers"

export const reactRouterUtils: ImportTransformEntry[] = createImportModEntries(
  "@qui/react-router-utils",
  [
    {
      imports: [
        "createThemeAction",
        "createThemeSessionResolver",
        "ThemeProvider",
        "useTheme",
        "themes",
        "Theme",
        "isTheme",
        "PreventFlashOnWrongTheme",
        "createThemeAction",
        "ThemeMetadata",
        "ThemeProviderProps",
        "ThemeProvider",
        "PreventFlashOnWrongTheme",
        "useTheme",
        "isTheme",
        "themes",
        "mediaQuery",
        "ThemeSessionResolver",
        "createThemeSessionResolver",
        "useBroadcastChannel",
        "useCorrectCssTransition",
        "updateDemoState",
        "createDemoStateUpdateAction",
        "SiteState",
        "updateSiteState",
        "createUpdateAction",
      ],
      targetPackage: "@qui/react-router-utils/client",
    },
  ],
)
