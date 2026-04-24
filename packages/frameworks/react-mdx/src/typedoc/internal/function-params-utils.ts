// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {QuiPropDeclaration} from "@qualcomm-ui/typedoc-common"

export function getDisplayName(param: QuiPropDeclaration): string {
  if (param.name === "__namedParameters") {
    return "options"
  }
  return param.name
}
