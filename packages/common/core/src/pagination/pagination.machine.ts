// Modified from https://github.com/chakra-ui/zag
// MIT License
// Changes from Qualcomm Technologies, Inc. are provided under the following license:
// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {range} from "@qualcomm-ui/utils/array"
import {createMachine, type MachineConfig} from "@qualcomm-ui/utils/machine"
import {memo} from "@qualcomm-ui/utils/memo"

import type {PageItem, PaginationSchema} from "./pagination.types"

export const paginationMachine: MachineConfig<PaginationSchema> =
  createMachine<PaginationSchema>({
    actions: {
      goToFirstPage: ({context}) => {
        context.set("page", 1)
      },
      goToLastPage: ({computed, context}) => {
        context.set("page", computed("pageCount"))
      },
      goToNextPage: ({computed, context}) => {
        context.set("page", (prev: number) =>
          clampPage(prev + 1, computed("pageCount")),
        )
      },
      goToPage({computed, context, event}) {
        if (event.type !== "GO_TO_PAGE") {
          return
        }
        context.set("page", clampPage(event.page, computed("pageCount")))
      },
      goToPrevPage: ({computed, context}) => {
        context.set("page", (prev: number) =>
          clampPage(prev - 1, computed("pageCount")),
        )
      },
      setPageIfNeeded: ({computed, context}) => {
        const prevPage = context.get("page")
        const pageCount = computed("pageCount")
        if (prevPage > pageCount) {
          context.set("page", 1)
        }
      },
      setPageSize: ({context, event}) => {
        if (event.type !== "SET_PAGE_SIZE") {
          return
        }
        context.set("pageSize", event.pageSize)
      },
    },
    computed: {
      pageCount: ({context, prop}) => {
        return Math.ceil(prop("count") / context.get("pageSize"))
      },
      pageEnd: ({context, prop}) => {
        const page = context.get("page")
        const rowsPerPage = context.get("pageSize")
        const totalRows = prop("count")

        if (totalRows === 0) {
          return 0
        }

        const end = page * rowsPerPage
        return Math.min(end, totalRows)
      },
      pageItems: memo(
        ({computed, context, prop}): [number, number, number, number] => [
          prop("boundaryCount"),
          context.get("page"),
          computed("pageCount"),
          prop("siblingCount"),
        ],
        (boundaryCount, page, pageCount, siblingCount) => {
          const startPages = range(1, Math.min(boundaryCount, pageCount))

          const endPages = range(
            Math.max(pageCount - boundaryCount + 1, boundaryCount + 1),
            pageCount,
          )

          const siblingsStart = Math.max(
            Math.min(
              // Natural start
              page - siblingCount,
              // Lower boundary when page is high
              pageCount - boundaryCount - siblingCount * 2 - 1,
            ),
            // Greater than startPages
            boundaryCount + 2,
          )

          const siblingsEnd = Math.min(
            Math.max(
              // Natural end
              page + siblingCount,
              // Upper boundary when page is low
              boundaryCount + siblingCount * 2 + 2,
            ),
            // Less than endPages
            endPages.length > 0 ? endPages[0] - 2 : pageCount - 1,
          )

          // Basic list of items to render
          const pageItems: PageItem[] = [
            ...startPages,

            // Start ellipsis
            ...(siblingsStart > boundaryCount + 2
              ? ["separator"]
              : boundaryCount + 1 < pageCount - boundaryCount
                ? [boundaryCount + 1]
                : []),

            // Sibling pages
            ...range(siblingsStart, siblingsEnd),

            // End ellipsis
            ...(siblingsEnd < pageCount - boundaryCount - 1
              ? ["separator"]
              : pageCount - boundaryCount > boundaryCount
                ? [pageCount - boundaryCount]
                : []),

            ...endPages,
          ].map((item) => {
            return item === "separator"
              ? ({
                  type: "separator",
                } satisfies PageItem)
              : ({
                  active: item === page,
                  label: `Go to page ${item}`,
                  page: item as number,
                  type: "page",
                } satisfies PageItem)
          })

          // always show at least one page
          if (!pageItems.length) {
            return [
              {
                active: true,
                label: `Go to page 1`,
                page: 1,
                type: "page",
              } satisfies PageItem,
            ]
          }

          return pageItems satisfies PageItem[]
        },
      ),
      pageMetadata: ({computed, context, prop}) => {
        return {
          count: prop("count"),
          page: context.get("page"),
          pageCount: computed("pageCount"),
          pageEnd: computed("pageEnd"),
          pageStart: computed("pageStart"),
        }
      },
      pageStart: ({context, prop}) => {
        const page = context.get("page")
        const rowsPerPage = context.get("pageSize")
        const totalRows = prop("count")

        if (totalRows === 0) {
          return 0
        }

        return (page - 1) * rowsPerPage + 1
      },
    },
    context: ({bindable, prop}) => {
      return {
        page: bindable<number>(() => ({
          defaultValue: prop("defaultPage"),
          name: "pagination-page",
          onChange: prop("onPageChange"),
          value: prop("page"),
        })),
        pageSize: bindable<number>(() => ({
          defaultValue: prop("defaultPageSize"),
          name: "pagination-rows-per-page",
          onChange: prop("onPageSizeChange"),
          value: prop("pageSize"),
        })),
      }
    },

    guards: {
      canGoToNextPage: ({computed, context}) => {
        return (
          context.get("page") < computed("pageCount") && context.get("page") > 0
        )
      },
      canGoToPage: ({computed, event}) => {
        if (event.type !== "GO_TO_PAGE") {
          return
        }
        const pageCount = computed("pageCount")
        return event.page > 0 && event.page <= pageCount
      },
      canGoToPrevPage: ({context}) => {
        return context.get("page") > 1
      },
    },

    ids: ({bindableId}) => {
      return {
        pageSizeLabel: bindableId<string | undefined>(),
      }
    },

    initialState() {
      return "idle"
    },

    on: {
      GO_TO_FIRST_PAGE: {
        actions: ["goToFirstPage"],
      },
      GO_TO_LAST_PAGE: {
        actions: ["goToLastPage"],
      },
      GO_TO_NEXT_PAGE: {
        actions: ["goToNextPage"],
        guard: "canGoToNextPage",
      },
      GO_TO_PAGE: {
        actions: ["goToPage"],
        guard: "canGoToPage",
      },
      GO_TO_PREV_PAGE: {
        actions: ["goToPrevPage"],
        guard: "canGoToPrevPage",
      },
      SET_PAGE_SIZE: {
        actions: ["setPageSize"],
      },
    },

    props: ({props}) => {
      return {
        boundaryCount: 1,
        count: 1,
        defaultPage: 1,
        defaultPageSize: 1,
        nextPageAriaLabel: "Go to next page",
        pageAriaLabel: (page) => `Go to page ${page}`,
        prevPageAriaLabel: "Go to previous page",
        siblingCount: 1,
        ...props,
      }
    },

    states: {
      idle: {},
    },

    watch({actions, context, track}) {
      track([() => context.get("pageSize")], () => {
        actions.setPageIfNeeded()
      })
    },
  })

const clampPage = (page: number, totalPages: number) =>
  Math.min(Math.max(page, 1), totalPages)
