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

export interface QdsBreadcrumbsOverflowTriggerBindings
  extends QdsBreadcrumbsCommonBindings {
  className: `${BreadcrumbsClasses["itemTrigger"]} ${BreadcrumbsClasses["overflowTrigger"]}`
  "data-emphasis": QdsBreadcrumbsEmphasis
}

export interface QdsBreadcrumbItemData<TIcon = unknown, TLink = unknown> {
  /**
   * Disables the breadcrumb item.
   */
  disabled?: boolean

  /**
   * URL of the breadcrumb item. Renders as a native `<a href="...">`.
   */
  href?: string

  /**
   * Icon displayed before the item label.
   */
  icon?: TIcon

  /**
   * Text content of the breadcrumb item.
   */
  label: string

  /**
   * Framework router destination. In React, a `<Link>` element; in Angular,
   * a `routerLink` string or path array.
   */
  link?: TLink
}

export interface QdsBreadcrumbsCollapsedRange {
  /** last collapsed item (exclusive). */
  end: number
  /** first collapsed item (inclusive). */
  start: number
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
  getOverflowTriggerBindings(): QdsBreadcrumbsOverflowTriggerBindings
  getRootBindings(): QdsBreadcrumbsRootBindings
}
