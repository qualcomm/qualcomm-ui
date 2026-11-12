// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {z} from "zod"

export type Implements<Model> = {
  [key in keyof Model]-?: undefined extends Model[key]
    ? null extends Model[key]
      ? z.ZodNullable<z.ZodOptional<z.ZodType<Model[key]>>>
      : z.ZodOptional<z.ZodType<Model[key]>>
    : null extends Model[key]
      ? z.ZodNullable<z.ZodType<Model[key]>>
      : z.ZodType<Model[key]> | z.ZodDefault<z.ZodType<Model[key]>>
}

/**
 * Formats a schema issue as `path.to[0].key: message`.
 */
export function formatSchemaIssue(
  issue: Pick<z.core.$ZodIssue, "message" | "path">,
): string {
  const path = issue.path
    .map((key, index) =>
      typeof key === "number"
        ? `[${key}]`
        : `${index === 0 ? "" : "."}${String(key)}`,
    )
    .join("")
  return path ? `${path}: ${issue.message}` : issue.message
}
