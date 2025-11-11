// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createImportModEntries} from "../mod-imports"
import type {ImportTransformEntry} from "../transformers"

export const tailwindPlugin: ImportTransformEntry[] = createImportModEntries(
  "@qui/tailwind-plugin",
  // TODO: figure out how to convert default to named.
  // quiPlugin and vscodePlugin were changed from default exports to named exports.
  [],
)
