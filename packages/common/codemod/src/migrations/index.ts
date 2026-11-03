// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {qdsV2Tokens} from "./qds-v2-tokens/index.js"
import {quiDocs} from "./qui-docs/index.js"
import type {MigrationGroup} from "./types.js"

export const migrationGroups: MigrationGroup[] = [quiDocs, qdsV2Tokens]

export * from "./run-migration.js"
export type * from "./types.js"
