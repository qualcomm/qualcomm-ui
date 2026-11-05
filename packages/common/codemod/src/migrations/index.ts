// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {quiDocs} from "./qui-docs/index.js"
import type {MigrationGroup} from "./types.js"

export const migrationGroups: MigrationGroup[] = [quiDocs]

export * from "./run-migration.js"
export type * from "./types.js"
