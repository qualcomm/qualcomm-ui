// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {MigrationGroup} from "../types.js"

import {docsContextNames} from "./docs-context-names/docs-context-names.js"
import {notFoundRoute} from "./not-found-route/not-found-route.js"

export type QuiDocsPackage =
  | "@qualcomm-ui/mdx-vite"
  | "@qualcomm-ui/react-mdx"
  | "@qualcomm-ui/react-router-utils"

export const quiDocs: MigrationGroup<QuiDocsPackage> = {
  codemods: [notFoundRoute, docsContextNames],
  description: "QUI documentation sites built with React Router",
  name: "qui-docs",
  packages: [
    "@qualcomm-ui/mdx-vite",
    "@qualcomm-ui/react-mdx",
    "@qualcomm-ui/react-router-utils",
  ],
}
