// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {InputTagsElementScope} from "../input-tags.types"

export function getContainerId(scope: InputTagsElementScope): string {
  return scope.ids.get("container")
}

function getClosestCombobox(scope: InputTagsElementScope): HTMLElement | null {
  return (
    getContainerEl(scope)?.closest(
      `[data-part="control"][data-scope="combobox"]`,
    ) || null
  )
}

function getClosestSelect(scope: InputTagsElementScope): HTMLElement | null {
  return (
    getContainerEl(scope)?.closest(
      `[data-part="control"][data-scope="select"]`,
    ) || null
  )
}

export function getControlEl(scope: InputTagsElementScope): HTMLElement | null {
  return getClosestCombobox(scope) ?? getClosestSelect(scope) ?? null
}

function getComboboxInputElement(
  scope: InputTagsElementScope,
): HTMLElement | null {
  return getClosestCombobox(scope)?.querySelector('[data-part="input"]') ?? null
}

function getSelectInputElement(
  scope: InputTagsElementScope,
): HTMLElement | null {
  return (
    getClosestSelect(scope)?.querySelector('[data-part="value-text"]') ?? null
  )
}

export function getInputElement(
  scope: InputTagsElementScope,
): HTMLElement | null {
  return getComboboxInputElement(scope) ?? getSelectInputElement(scope) ?? null
}

export function getContainerEl(
  scope: InputTagsElementScope,
): HTMLElement | null {
  return scope.getById(getContainerId(scope))
}

export function getTagId(scope: InputTagsElementScope, value: string): string {
  return `tags:${getContainerId(scope)}:tag:${value}`
}

export function getInvisibleTagId(
  scope: InputTagsElementScope,
  value: string,
): string {
  return `tags:${getContainerId(scope)}:invisible-tag:${value}`
}

export function getTagEl(
  scope: InputTagsElementScope,
  value: string,
): HTMLElement | null {
  return scope.getById(getTagId(scope, value))
}

export function getInvisibleTagEl(
  scope: InputTagsElementScope,
  value: string,
): HTMLElement | null {
  return scope.getById(getInvisibleTagId(scope, value))
}

export function getInvisibleTagsContainerEl(
  scope: InputTagsElementScope,
): HTMLElement | null {
  return scope.getById(scope.ids.get("invisibleTagsContainer"))
}

export function getIndicatorId(scope: InputTagsElementScope): string {
  return `tags:${getContainerId(scope)}:indicator`
}

export function getIndicatorEl(
  scope: InputTagsElementScope,
): HTMLElement | null {
  return scope.getById(getIndicatorId(scope))
}

export function getMeasureIndicatorId(scope: InputTagsElementScope): string {
  return `tags:${getContainerId(scope)}:measure-indicator`
}

export function getMeasureIndicatorEl(
  scope: InputTagsElementScope,
): HTMLElement | null {
  return scope.getById(getMeasureIndicatorId(scope))
}
