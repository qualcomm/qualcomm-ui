// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {Scope} from "@qualcomm-ui/utils/machine"

export function getContainerId(scope: Scope): string {
  return `tags:${scope.id}:container`
}

export function getContainerEl(scope: Scope): HTMLElement | null {
  return scope.getById(getContainerId(scope))
}

export function getTagId(scope: Scope, value: string): string {
  return `tags:${scope.id}:tag:${value}`
}

export function getTagEl(scope: Scope, value: string): HTMLElement | null {
  return scope.getById(getTagId(scope, value))
}

export function getIndicatorId(scope: Scope): string {
  return `tags:${scope.id}:indicator`
}

export function getIndicatorEl(scope: Scope): HTMLElement | null {
  return scope.getById(getIndicatorId(scope))
}

export function getMeasureIndicatorId(scope: Scope): string {
  return `tags:${scope.id}:measure-indicator`
}

export function getMeasureIndicatorEl(scope: Scope): HTMLElement | null {
  return scope.getById(getMeasureIndicatorId(scope))
}
