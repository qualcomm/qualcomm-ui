// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {createImportModEntries} from "../mod-imports"
import type {ImportTransformEntry} from "../transformers"

export const base: ImportTransformEntry[] = createImportModEntries(
  "@qui/base",
  [
    {
      imports: ["ensureArray"],
      targetPackage: "@qui/utils/array",
    },
    {
      imports: ["clsx", "classValue"],
      targetPackage: "@qui/utils/clsx",
    },
    {
      imports: ["escapeStringRegexp"],
      targetPackage: "@qui/utils/escape-string-regexp",
    },
    {
      imports: ["dedent"],
      targetPackage: "@qui/utils/dedent",
    },
    {
      imports: ["defined", "isDefined"],
      targetPackage: "@qui/utils/guard",
    },
    {
      imports: ["matchSorter"],
      targetPackage: "@qui/utils/match-sorter",
    },
    {
      // TODO: add support for `importsToRename`. This option doesn't do
      //  anything at the moment.
      imports: [{name: "QAnimationEasing", renameTo: "AnimationEasing"}],
      targetPackage: "@qui/utils/transitions",
    },
  ],
)
