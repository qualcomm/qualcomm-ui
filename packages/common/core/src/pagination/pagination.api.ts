// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {booleanDataAttr} from "@qualcomm-ui/utils/attributes"
import type {Machine, PropNormalizer} from "@qualcomm-ui/utils/machine"

import type {
  PageItem,
  PaginationApi,
  PaginationNextTriggerBindings,
  PaginationPageItemBindings,
  PaginationPageItemsBindings,
  PaginationPageMetadataBindings,
  PaginationPageSizeBindings,
  PaginationPageSizeLabelBindings,
  PaginationPrevTriggerBindings,
  PaginationRootBindings,
  PaginationSchema,
} from "./pagination.types"

export function createPaginationApi(
  store: Machine<PaginationSchema>,
  normalize: PropNormalizer,
): PaginationApi {
  const {computed, context, prop, scope, send} = store
  const page = context.get("page")
  const pageCount = computed("pageCount")
  const pageSize = context.get("pageSize")
  const pageItems = computed("pageItems")
  const pageStart = computed("pageStart")
  const pageEnd = computed("pageEnd")
  const pageMetadata = computed("pageMetadata")

  const elementScope: {"data-scope": "pagination"} = {
    "data-scope": "pagination",
  }

  const isFirstPage = page === 1
  const isLastPage = page === pageCount

  return {
    getNextTriggerBindings(): PaginationNextTriggerBindings {
      const isDisabled = isLastPage
      return normalize.button({
        ...elementScope,
        "aria-label": prop("nextPageAriaLabel"),
        "data-disabled": booleanDataAttr(isDisabled),
        "data-part": "next-trigger",
        disabled: isDisabled,
        onClick() {
          send({type: "GO_TO_NEXT_PAGE"})
        },
      })
    },

    getPageItemBindings(item: PageItem): PaginationPageItemBindings {
      if (item.type === "separator") {
        return normalize.element({
          "data-part": "page-item",
          "data-scope": "pagination",
          "data-type": "separator",
          disabled: true,
          role: "separator",
        })
      }
      const itemPage = item.page
      const isActive = itemPage === page
      return normalize.button({
        ...elementScope,
        "aria-current": isActive ? "page" : undefined,
        "aria-label": prop("pageAriaLabel")(itemPage),
        "data-active": booleanDataAttr(isActive),
        "data-page": itemPage,
        "data-part": "page-item",
        "data-type": "page",
        onClick() {
          send({page: itemPage, type: "GO_TO_PAGE"})
        },
      })
    },

    getPageItemsBindings(): PaginationPageItemsBindings {
      return normalize.element({
        ...elementScope,
        "data-part": "page-items",
      })
    },

    getPageMetadataBindings(): PaginationPageMetadataBindings {
      return normalize.element({
        ...elementScope,
        "data-part": "page-metadata",
      })
    },

    getPageSizeBindings(): PaginationPageSizeBindings {
      return {
        ...elementScope,
        "data-part": "page-size",
      }
    },

    getPageSizeLabelBindings({id, onDestroy}): PaginationPageSizeLabelBindings {
      scope.ids.register("pageSizeLabel", id, onDestroy)

      return {
        ...elementScope,
        "data-part": "page-size-label",
        id,
      }
    },

    getPrevTriggerBindings(): PaginationPrevTriggerBindings {
      const isDisabled = isFirstPage
      return normalize.button({
        ...elementScope,
        "aria-label": prop("prevPageAriaLabel"),
        "data-disabled": booleanDataAttr(isDisabled),
        "data-part": "prev-trigger",
        disabled: isDisabled,
        onClick(event) {
          if (event.defaultPrevented) {
            return
          }
          send({type: "GO_TO_PREV_PAGE"})
        },
      })
    },

    getRootBindings(): PaginationRootBindings {
      return normalize.element({
        ...elementScope,
        "data-part": "root",
      })
    },

    // prevent key sorter from sorting these props above the getters
    ...{},
    defaultPageSize: prop("defaultPageSize"),
    goToFirstPage: () => {
      send({type: "GO_TO_FIRST_PAGE"})
    },

    goToLastPage: () => send({type: "GO_TO_LAST_PAGE"}),
    goToNextPage: () => send({type: "GO_TO_NEXT_PAGE"}),
    goToPage: (page) =>
      send({
        page,
        type: "GO_TO_PAGE",
      }),
    goToPrevPage: () => {
      send({type: "GO_TO_PREV_PAGE"})
    },
    page,
    pageCount,
    pageEnd,
    pageItems,
    pageMetadata,
    pageSize,
    pageSizeLabelId: scope.ids.get("pageSizeLabel"),
    pageStart,
    setPageSize: (pageSize) =>
      send({
        pageSize,
        type: "SET_PAGE_SIZE",
      }),
  }
}
