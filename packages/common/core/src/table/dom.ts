// Modified from https://github.com/tanstack/table
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

export const safeDocument: Document | null =
  typeof document === "undefined" ? null : document
export const safeWindow: null | Window =
  typeof window === "undefined" ? null : window
