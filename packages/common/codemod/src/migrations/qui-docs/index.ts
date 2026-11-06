// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {docsContextNames} from "./docs-context-names/docs-context-names.js"
import {fallbackRouteMiddleware} from "./fallback-route-middleware/fallback-route-middleware.js"
import {fallbackRoute} from "./fallback-route/fallback-route.js"
import {notFoundRoute} from "./not-found-route/not-found-route.js"
import {removeOpenWebUi} from "./remove-open-web-ui/remove-open-web-ui.js"
import {validatePageLinks} from "./validate-page-links/validate-page-links.js"

export type QuiDocsPackage =
  | "@qualcomm-ui/mdx-vite"
  | "@qualcomm-ui/react-mdx"
  | "@qualcomm-ui/react-router-utils"

export const quiDocs: MigrationGroup<QuiDocsPackage> = {
  codemods: [
    fallbackRoute,
    notFoundRoute,
    docsContextNames,
    fallbackRouteMiddleware,
    removeOpenWebUi,
    validatePageLinks,
  ],
  description: "QUI documentation sites built with React Router",
  name: "qui-docs",
  packages: [
    "@qualcomm-ui/mdx-vite",
    "@qualcomm-ui/react-mdx",
    "@qualcomm-ui/react-router-utils",
  ],
}
