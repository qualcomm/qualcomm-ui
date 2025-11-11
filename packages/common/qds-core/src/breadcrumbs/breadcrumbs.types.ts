// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {BooleanDataAttr} from "@qualcomm-ui/utils/attributes"

import type {breadcrumbsClasses} from "./breadcrumbs.classes"

export type QdsBreadcrumbsSize = "sm" | "md" | "lg"

export type QdsBreadcrumbsEmphasis = "primary" | "neutral"

export interface QdsBreadcrumbsApiProps {
  /**
   * Governs the color of the breadcrumb item text and icon.
   * @default 'primary'
   */
  emphasis?: QdsBreadcrumbsEmphasis

  /**
   * Governs the size of the breadcrumb item text and icon.
   * @default 'md'
   */
  size?: QdsBreadcrumbsSize
}

type BreadcrumbsClasses = typeof breadcrumbsClasses

interface QdsBreadcrumbsCommonBindings {
  "data-size": QdsBreadcrumbsSize
}

export interface QdsBreadcrumbsRootBindings
  extends QdsBreadcrumbsCommonBindings {
  className: BreadcrumbsClasses["root"]
}

export interface QdsBreadcrumbsListBindings {
  className: BreadcrumbsClasses["list"]
}

export interface QdsBreadcrumbsItemBindings {
  className: BreadcrumbsClasses["item"]
  "data-disabled": BooleanDataAttr
}

export interface QdsBreadcrumbsItemSeparatorBindings
  extends QdsBreadcrumbsCommonBindings {
  "aria-hidden": true
  className: BreadcrumbsClasses["separator"]
  "data-size": QdsBreadcrumbsSize
}

export interface QdsBreadcrumbsItemIconBindings
  extends QdsBreadcrumbsCommonBindings {
  className: BreadcrumbsClasses["itemIcon"]
  "data-emphasis": QdsBreadcrumbsEmphasis
}

export interface QdsBreadcrumbsItemTriggerBindings
  extends QdsBreadcrumbsCommonBindings {
  className: BreadcrumbsClasses["itemTrigger"]
  "data-emphasis": QdsBreadcrumbsEmphasis
}

export interface QdsBreadcrumbsItemApiProps {
  /**
   * Controls the component's interactivity. If `true`, the component becomes
   * unresponsive to input and is visually dimmed to indicate its disabled state.
   */
  disabled?: boolean
}

export interface QdsBreadcrumbsApi {
  emphasis: QdsBreadcrumbsEmphasis
  size: QdsBreadcrumbsSize

  // group: bindings
  getItemBindings(
    params: QdsBreadcrumbsItemApiProps,
  ): QdsBreadcrumbsItemBindings
  getItemIconBindings(): QdsBreadcrumbsItemIconBindings
  getItemSeparatorBindings(): QdsBreadcrumbsItemSeparatorBindings
  getItemTriggerBindings(): QdsBreadcrumbsItemTriggerBindings
  getListBindings(): QdsBreadcrumbsListBindings
  getRootBindings(): QdsBreadcrumbsRootBindings
}
