// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {TagElementScope} from "../tags.types"

export function getContainerId(scope: TagElementScope): string {
  return scope.ids.get("container")
}

function getClosestCombobox(scope: TagElementScope): HTMLElement | null {
  return (
    getContainerEl(scope)?.closest(
      `[data-part="control"][data-scope="combobox"]`,
    ) || null
  )
}

function getClosestSelect(scope: TagElementScope): HTMLElement | null {
  return (
    getContainerEl(scope)?.closest(
      `[data-part="control"][data-scope="select"]`,
    ) || null
  )
}

export function getControlEl(scope: TagElementScope): HTMLElement | null {
  return getClosestCombobox(scope) ?? getClosestSelect(scope) ?? null
}

function getComboboxInputElement(scope: TagElementScope): HTMLElement | null {
  return getClosestCombobox(scope)?.querySelector('[data-part="input"]') ?? null
}

function getSelectInputElement(scope: TagElementScope): HTMLElement | null {
  return (
    getClosestSelect(scope)?.querySelector('[data-part="value-text"]') ?? null
  )
}

export function getInputElement(scope: TagElementScope): HTMLElement | null {
  return getComboboxInputElement(scope) ?? getSelectInputElement(scope) ?? null
}

export function getContainerEl(scope: TagElementScope): HTMLElement | null {
  return scope.getById(getContainerId(scope))
}

export function getTagId(scope: TagElementScope, value: string): string {
  return `tags:${getContainerId(scope)}:tag:${value}`
}

export function getInvisibleTagId(
  scope: TagElementScope,
  value: string,
): string {
  return `tags:${getContainerId(scope)}:invisible-tag:${value}`
}

export function getTagEl(
  scope: TagElementScope,
  value: string,
): HTMLElement | null {
  return scope.getById(getTagId(scope, value))
}

export function getInvisibleTagEl(
  scope: TagElementScope,
  value: string,
): HTMLElement | null {
  return scope.getById(getInvisibleTagId(scope, value))
}

export function getInvisibleTagsContainerEl(
  scope: TagElementScope,
): HTMLElement | null {
  return scope.getById(scope.ids.get("invisibleTagsContainer"))
}

export function getIndicatorId(scope: TagElementScope): string {
  return `tags:${getContainerId(scope)}:indicator`
}

export function getIndicatorEl(scope: TagElementScope): HTMLElement | null {
  return scope.getById(getIndicatorId(scope))
}

export function getMeasureIndicatorId(scope: TagElementScope): string {
  return `tags:${getContainerId(scope)}:measure-indicator`
}

export function getMeasureIndicatorEl(
  scope: TagElementScope,
): HTMLElement | null {
  return scope.getById(getMeasureIndicatorId(scope))
}
