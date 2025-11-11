// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ReactNode, Ref} from "react"

import type {RenderPropLegacy} from "@qualcomm-ui/react-core/system"

export function getChildRef<T>(
  children: ReactNode | RenderPropLegacy<T>,
): Ref<any> | undefined {
  return (children as any)?.ref
}
