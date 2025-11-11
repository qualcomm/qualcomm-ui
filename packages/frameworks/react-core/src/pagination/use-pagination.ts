// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {
  createPaginationApi,
  type PageItem,
  type PageMetadata,
  type PaginationApi,
  type PaginationApiProps,
  paginationMachine,
  type PaginationNextTriggerBindings,
  type PaginationPageItemsBindings,
  type PaginationPageMetadataBindings,
  type PaginationPageSizeLabelBindings,
  type PaginationPrevTriggerBindings,
} from "@qualcomm-ui/core/pagination"
import {useOnDestroy} from "@qualcomm-ui/react-core/effects"
import {normalizeProps, useMachine} from "@qualcomm-ui/react-core/machine"
import {useControlledId} from "@qualcomm-ui/react-core/state"

import {usePaginationContext} from "./pagination-context"

export interface UsePaginationProps extends PaginationApiProps {}

export function usePagination(props: UsePaginationProps): PaginationApi {
  const config = useMachine(paginationMachine, props)
  return createPaginationApi(config, normalizeProps)
}

export function usePaginationNextTrigger(): PaginationNextTriggerBindings {
  const context = usePaginationContext()
  return context.getNextTriggerBindings()
}

export interface UsePaginationPageItemsReturn {
  pageItems: PageItem[]
  props: PaginationPageItemsBindings
}

export function usePaginationPageItems(): UsePaginationPageItemsReturn {
  const context = usePaginationContext()
  return {pageItems: context.pageItems, props: context.getPageItemsBindings()}
}

export function usePaginationPrevTrigger(): PaginationPrevTriggerBindings {
  const context = usePaginationContext()
  return context.getPrevTriggerBindings()
}

export interface UsePaginationPageMetadataReturn {
  pageMetadata: PageMetadata
  props: PaginationPageMetadataBindings
}

export function usePaginationPageMetadata(): UsePaginationPageMetadataReturn {
  const context = usePaginationContext()
  return {
    pageMetadata: context.pageMetadata,
    props: context.getPageMetadataBindings(),
  }
}

export interface UsePaginationPageSizeLabelProps {
  /**
   * {@link https://www.w3schools.com/html/html_id.asp id attribute}. If
   * omitted, a unique identifier will be automatically generated for accessibility.
   */
  id?: string
}

export function usePaginationPageSizeLabel({
  id: idProp,
}: UsePaginationPageSizeLabelProps): PaginationPageSizeLabelBindings {
  const context = usePaginationContext()
  const id = useControlledId(idProp)
  return context.getPageSizeLabelBindings({id, onDestroy: useOnDestroy()})
}
