// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {paginationClasses} from "./pagination.classes"

export type QdsPaginationSize = "sm" | "md"

export interface QdsPaginationApiProps {
  /**
   * Governs the size and padding of pagination elements.
   *
   * @default 'sm'
   */
  size?: QdsPaginationSize
}

type PaginationClasses = typeof paginationClasses

export interface QdsPaginationRootBindings {
  className: PaginationClasses["root"]
}

export interface QdsPaginationPageSizeLabelBindings {
  className: PaginationClasses["pageSizeLabel"]
  "data-size": QdsPaginationSize
}

export interface QdsPaginationPageItemBindings {
  className: PaginationClasses["pageItem"]
  "data-size": QdsPaginationSize
}

export interface QdsPaginationPageMetadataBindings {
  className: PaginationClasses["pageMetadata"]
  "data-size": QdsPaginationSize
}

export interface QdsPaginationPageSizeBindings {
  className: PaginationClasses["pageSize"]
  "data-size": QdsPaginationSize
}

export interface QdsPaginationApi {
  size: QdsPaginationSize

  // group: bindings
  getPageItemBindings(): QdsPaginationPageItemBindings
  getPageMetadataBindings(): QdsPaginationPageMetadataBindings
  getPageSizeBindings(): QdsPaginationPageSizeBindings
  getPageSizeLabelBindings(): QdsPaginationPageSizeLabelBindings
  getRootBindings(): QdsPaginationRootBindings
}
