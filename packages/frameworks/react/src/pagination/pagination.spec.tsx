import {type ReactElement, useState} from "react"

import {describe, expect, test, vi} from "vitest"
import {render} from "vitest-browser-react"
import {page, userEvent} from "vitest/browser"

import {Pagination} from "@qualcomm-ui/react/pagination"

import {type MultiComponentTest, runTests} from "~test-utils/runner"

const testIds = {
  nextTrigger: "pagination-next",
  pageItems: "pagination-page-items",
  pageMetadata: "pagination-page-metadata",
  pageSize: "pagination-page-size",
  pageSizeLabel: "pagination-page-size-label",
  prevTrigger: "pagination-prev",
  root: "pagination-root",
}

function getPrevButton() {
  return page.getByRole("button", {name: "Go to previous page"})
}

function getNextButton() {
  return page.getByRole("button", {name: "Go to next page"})
}

function getPageButton(pageNumber: number) {
  return page.getByRole("button", {
    exact: true,
    name: `Go to page ${pageNumber}`,
  })
}

const tests: MultiComponentTest[] = [
  {
    composite() {
      return (
        <Pagination.Root count={100} defaultPage={1} pageSize={10}>
          <Pagination.PrevTrigger />
          <Pagination.PageItems />
          <Pagination.NextTrigger />
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("renders initial page", async () => {
        await render(getComponent())

        await expect
          .element(getPageButton(1))
          .toHaveAttribute("aria-current", "page")
        await expect
          .element(getPageButton(2))
          .not.toHaveAttribute("aria-current")
      })
    },
  },
  {
    composite() {
      function Component(): ReactElement {
        const [currentPage, setCurrentPage] = useState(1)
        return (
          <>
            <div data-test-id="current-page">{currentPage}</div>
            <Pagination.Root
              count={100}
              onPageChange={setCurrentPage}
              page={currentPage}
              pageSize={10}
            >
              <Pagination.PrevTrigger />
              <Pagination.PageItems />
              <Pagination.NextTrigger />
            </Pagination.Root>
          </>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("next trigger advances page", async () => {
        await render(getComponent())

        await expect
          .element(getPageButton(1))
          .toHaveAttribute("aria-current", "page")

        await getNextButton().click()

        await expect
          .element(getPageButton(2))
          .toHaveAttribute("aria-current", "page")
        await expect
          .element(page.getByTestId("current-page"))
          .toHaveTextContent("2")
      })
    },
  },
  {
    composite() {
      function Component(): ReactElement {
        const [currentPage, setCurrentPage] = useState(3)
        return (
          <>
            <div data-test-id="current-page">{currentPage}</div>
            <Pagination.Root
              count={100}
              onPageChange={setCurrentPage}
              page={currentPage}
              pageSize={10}
            >
              <Pagination.PrevTrigger />
              <Pagination.PageItems />
              <Pagination.NextTrigger />
            </Pagination.Root>
          </>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("prev trigger goes back", async () => {
        await render(getComponent())

        await expect
          .element(getPageButton(3))
          .toHaveAttribute("aria-current", "page")

        await getPrevButton().click()

        await expect
          .element(getPageButton(2))
          .toHaveAttribute("aria-current", "page")
        await expect
          .element(page.getByTestId("current-page"))
          .toHaveTextContent("2")
      })
    },
  },
  {
    composite() {
      return (
        <Pagination.Root count={100} defaultPage={1} pageSize={10}>
          <Pagination.PrevTrigger />
          <Pagination.PageItems />
          <Pagination.NextTrigger />
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("prev disabled on page 1", async () => {
        await render(getComponent())

        await expect.element(getPrevButton()).toBeDisabled()
        await expect.element(getNextButton()).not.toBeDisabled()
      })
    },
  },
  {
    composite() {
      return (
        <Pagination.Root count={100} defaultPage={10} pageSize={10}>
          <Pagination.PrevTrigger />
          <Pagination.PageItems />
          <Pagination.NextTrigger />
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("next disabled on last page", async () => {
        await render(getComponent())

        await expect.element(getNextButton()).toBeDisabled()
        await expect.element(getPrevButton()).not.toBeDisabled()
      })
    },
  },
  {
    composite() {
      const onPageChange = vi.fn()
      return (
        <Pagination.Root
          count={100}
          defaultPage={1}
          onPageChange={onPageChange}
          pageSize={10}
        >
          <Pagination.PrevTrigger />
          <Pagination.PageItems />
          <Pagination.NextTrigger />
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("click specific page number navigates to that page", async () => {
        await render(getComponent())

        await expect
          .element(getPageButton(1))
          .toHaveAttribute("aria-current", "page")

        await getPageButton(3).click()

        await expect
          .element(getPageButton(3))
          .toHaveAttribute("aria-current", "page")
        await expect
          .element(getPageButton(1))
          .not.toHaveAttribute("aria-current")
      })
    },
  },
  {
    composite() {
      function Component(): ReactElement {
        const [currentPage, setCurrentPage] = useState(1)
        return (
          <>
            <div data-test-id="current-page">{currentPage}</div>
            <Pagination.Root
              count={100}
              onPageChange={setCurrentPage}
              page={currentPage}
              pageSize={10}
            >
              <Pagination.PrevTrigger />
              <Pagination.PageItems />
              <Pagination.NextTrigger />
            </Pagination.Root>
          </>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("controlled page reflects external state changes", async () => {
        await render(getComponent())

        await expect
          .element(page.getByTestId("current-page"))
          .toHaveTextContent("1")

        await getPageButton(4).click()

        await expect
          .element(page.getByTestId("current-page"))
          .toHaveTextContent("4")
        await expect
          .element(getPageButton(4))
          .toHaveAttribute("aria-current", "page")
      })
    },
  },
  {
    composite() {
      return (
        <Pagination.Root count={100} defaultPage={5} pageSize={10}>
          <Pagination.PrevTrigger />
          <Pagination.PageItems />
          <Pagination.NextTrigger />
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("defaultPage sets initial rendered page", async () => {
        await render(getComponent())

        await expect
          .element(getPageButton(5))
          .toHaveAttribute("aria-current", "page")
        await expect
          .element(getPageButton(1))
          .not.toHaveAttribute("aria-current")
      })
    },
  },
  {
    composite() {
      return (
        <Pagination.Root count={5} pageSize={10}>
          <Pagination.PrevTrigger />
          <Pagination.PageItems />
          <Pagination.NextTrigger />
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("single page disables both prev and next triggers", async () => {
        await render(getComponent())

        await expect.element(getPrevButton()).toBeDisabled()
        await expect.element(getNextButton()).toBeDisabled()
        await expect
          .element(getPageButton(1))
          .toHaveAttribute("aria-current", "page")
      })
    },
  },
  {
    composite() {
      return (
        <Pagination.Root count={115} pageSize={10}>
          <Pagination.PageMetadata />
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("PageMetadata renders default current page info", async () => {
        await render(getComponent())

        await expect.element(page.getByText("1 of 12")).toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Pagination.Root count={115} defaultPage={2} pageSize={10}>
          <Pagination.PageMetadata>
            {({count, pageEnd, pageStart}) => (
              <span>
                Showing {pageStart}-{pageEnd} of {count} items
              </span>
            )}
          </Pagination.PageMetadata>
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("PageMetadata supports custom render with page range", async () => {
        await render(getComponent())

        await expect
          .element(page.getByText("Showing 11-20 of 115 items"))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      return (
        <Pagination.Root
          count={100}
          data-test-id={testIds.root}
          defaultPage={1}
          pageSize={10}
        >
          <Pagination.PrevTrigger data-test-id={testIds.prevTrigger} />
          <Pagination.PageItems />
          <Pagination.NextTrigger data-test-id={testIds.nextTrigger} />
          <Pagination.PageMetadata data-test-id={testIds.pageMetadata} />
          <Pagination.PageSize
            data-test-id={testIds.pageSize}
            options={[10, 20, 50]}
          >
            <Pagination.PageSizeLabel data-test-id={testIds.pageSizeLabel}>
              Items per page
            </Pagination.PageSizeLabel>
          </Pagination.PageSize>
        </Pagination.Root>
      )
    },
    testCase: (getComponent) => {
      test("parts render correctly", async () => {
        await render(getComponent())

        await expect.element(page.getByTestId(testIds.root)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.prevTrigger))
          .toBeVisible()
        await expect
          .element(page.getByTestId(testIds.nextTrigger))
          .toBeVisible()
        await expect
          .element(page.getByTestId(testIds.pageMetadata))
          .toBeVisible()
        await expect.element(page.getByTestId(testIds.pageSize)).toBeVisible()
        await expect
          .element(page.getByTestId(testIds.pageSizeLabel))
          .toBeVisible()
      })
    },
  },
  {
    composite() {
      function Component(): ReactElement {
        const [pageSize, setPageSize] = useState(10)
        return (
          <>
            <div data-test-id="current-page-size">{pageSize}</div>
            <Pagination.Root
              count={100}
              defaultPage={1}
              onPageSizeChange={setPageSize}
              pageSize={pageSize}
            >
              <Pagination.PageSize options={[10, 20, 50]}>
                <Pagination.PageSizeLabel>
                  Items per page
                </Pagination.PageSizeLabel>
              </Pagination.PageSize>
            </Pagination.Root>
          </>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("PageSize changes update page size state", async () => {
        await render(getComponent())

        await expect
          .element(page.getByTestId("current-page-size"))
          .toHaveTextContent("10")

        await page.getByLabelText("Items per page").click()
        await page.getByRole("menuitem", {name: "20"}).click()

        await expect
          .element(page.getByTestId("current-page-size"))
          .toHaveTextContent("20")
      })
    },
  },
  {
    composite() {
      function Component(): ReactElement {
        const [currentPage, setCurrentPage] = useState(1)
        return (
          <>
            <div data-test-id="current-page">{currentPage}</div>
            <Pagination.Root
              count={100}
              onPageChange={setCurrentPage}
              page={currentPage}
              pageSize={10}
            >
              <Pagination.PrevTrigger />
              <Pagination.PageItems />
              <Pagination.NextTrigger />
            </Pagination.Root>
          </>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("keyboard: Enter on focused page item selects it", async () => {
        await render(getComponent())

        const targetPage = getPageButton(3)
        targetPage.element().focus()
        await expect.element(targetPage).toHaveFocus()

        await userEvent.keyboard("{Enter}")

        await expect
          .element(page.getByTestId("current-page"))
          .toHaveTextContent("3")
        await expect
          .element(getPageButton(3))
          .toHaveAttribute("aria-current", "page")
      })
    },
  },
  {
    composite() {
      function Component(): ReactElement {
        const [currentPage, setCurrentPage] = useState(1)
        return (
          <>
            <div data-test-id="current-page">{currentPage}</div>
            <Pagination.Root
              count={100}
              onPageChange={setCurrentPage}
              page={currentPage}
              pageSize={10}
            >
              <Pagination.PrevTrigger />
              <Pagination.PageItems />
              <Pagination.NextTrigger />
            </Pagination.Root>
          </>
        )
      }
      return <Component />
    },
    testCase: (getComponent) => {
      test("keyboard: Space on focused page item selects it", async () => {
        await render(getComponent())

        const targetPage = getPageButton(2)
        targetPage.element().focus()
        await expect.element(targetPage).toHaveFocus()

        await userEvent.keyboard(" ")

        await expect
          .element(page.getByTestId("current-page"))
          .toHaveTextContent("2")
        await expect
          .element(getPageButton(2))
          .toHaveAttribute("aria-current", "page")
      })
    },
  },
]

describe("Pagination", () => {
  runTests(tests)
})
