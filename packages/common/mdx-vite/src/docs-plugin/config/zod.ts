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
