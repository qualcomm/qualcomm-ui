// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

/**
 * Thrown by a codemod to cancel the whole migration: the remaining codemods
 * don't run and package.json isn't updated. Throw it before writing any file,
 * so that the project is left unchanged.
 */
export class MigrationCancelledError extends Error {
  override name = "MigrationCancelledError"
}
