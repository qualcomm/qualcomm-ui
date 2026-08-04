import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page, userEvent} from "vitest/browser"

import {PaginationModule} from "@qualcomm-ui/angular/pagination"

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

function getCurrentPageStatus() {
  return page.getByRole("status", {name: "Current page"})
}

function getCurrentPageSizeStatus() {
  return page.getByRole("status", {name: "Current page size"})
}

@Component({
  imports: [PaginationModule],
  template: `
    <div count="100" defaultPageSize="10" q-pagination-root>
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
    </div>
  `,
})
class DefaultPaginationComponent {}

@Component({
  imports: [PaginationModule],
  template: `
    <div count="100" defaultPage="5" defaultPageSize="10" q-pagination-root>
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
    </div>
  `,
})
class DefaultPagePaginationComponent {}

@Component({
  imports: [PaginationModule],
  template: `
    <div count="100" defaultPage="10" defaultPageSize="10" q-pagination-root>
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
    </div>
  `,
})
class LastPagePaginationComponent {}

@Component({
  imports: [PaginationModule],
  template: `
    <div count="5" defaultPageSize="10" q-pagination-root>
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
    </div>
  `,
})
class SinglePagePaginationComponent {}

@Component({
  imports: [PaginationModule],
  template: `
    <output aria-label="Current page">{{ currentPage() }}</output>
    <div
      count="100"
      q-pagination-root
      [page]="currentPage()"
      [pageSize]="10"
      (pageChanged)="currentPage.set($event)"
    >
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
    </div>
  `,
})
class ControlledPaginationComponent {
  protected readonly currentPage = signal(1)
}

@Component({
  imports: [PaginationModule],
  template: `
    <output aria-label="Current page">{{ currentPage() }}</output>
    <div
      count="100"
      q-pagination-root
      [page]="currentPage()"
      [pageSize]="10"
      (pageChanged)="currentPage.set($event)"
    >
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
    </div>
  `,
})
class ControlledPageThreePaginationComponent {
  protected readonly currentPage = signal(3)
}

@Component({
  imports: [PaginationModule],
  template: `
    <output aria-label="Current page">{{ currentPage() }}</output>
    <button type="button" (click)="currentPage.set(4)">Set page 4</button>
    <div
      count="100"
      q-pagination-root
      [page]="currentPage()"
      [pageSize]="10"
      (pageChanged)="currentPage.set($event)"
    >
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
    </div>
  `,
})
class ExternallyControlledPaginationComponent {
  protected readonly currentPage = signal(1)
}

@Component({
  imports: [PaginationModule],
  template: `
    <div count="115" defaultPageSize="10" q-pagination-root>
      <span *paginationContext="let context" q-pagination-page-metadata>
        @let metadata = context.pageMetadata;
        {{ metadata.page }} of {{ metadata.pageCount }}
      </span>
    </div>
  `,
})
class PageInfoMetadataComponent {}

@Component({
  imports: [PaginationModule],
  template: `
    <div count="115" defaultPage="2" defaultPageSize="10" q-pagination-root>
      <span *paginationContext="let context" q-pagination-page-metadata>
        @let metadata = context.pageMetadata;
        Showing {{ metadata.pageStart }}-{{ metadata.pageEnd }} of
        {{ metadata.count }} items
      </span>
    </div>
  `,
})
class PageRangeMetadataComponent {}

@Component({
  imports: [PaginationModule],
  template: `
    <div count="100" defaultPageSize="10" q-pagination-root>
      <button q-pagination-prev-trigger></button>
      <q-pagination-page-items />
      <button q-pagination-next-trigger></button>
      <span *paginationContext="let context" q-pagination-page-metadata>
        @let metadata = context.pageMetadata;
        {{ metadata.page }} of {{ metadata.pageCount }}
      </span>
      <div q-pagination-page-size [options]="[10, 20, 50]">
        <span q-pagination-page-size-label>Items per page</span>
      </div>
    </div>
  `,
})
class PartsPaginationComponent {}

@Component({
  imports: [PaginationModule],
  template: `
    <output aria-label="Current page size">{{ currentPageSize() }}</output>
    <div
      count="100"
      defaultPage="1"
      q-pagination-root
      [pageSize]="currentPageSize()"
      (pageSizeChanged)="currentPageSize.set($event)"
    >
      <div q-pagination-page-size [options]="[10, 20, 50]">
        <span q-pagination-page-size-label>Items per page</span>
      </div>
    </div>
  `,
})
class PageSizePaginationComponent {
  protected readonly currentPageSize = signal(10)
}

describe("Pagination", () => {
  test("renders initial page", async () => {
    await render(DefaultPaginationComponent)

    await expect
      .element(getPageButton(1))
      .toHaveAttribute("aria-current", "page")
    await expect.element(getPageButton(2)).not.toHaveAttribute("aria-current")
  })

  test("next trigger advances page and emits the page change", async () => {
    await render(ControlledPaginationComponent)

    await expect
      .element(getPageButton(1))
      .toHaveAttribute("aria-current", "page")

    await getNextButton().click()

    await expect
      .element(getPageButton(2))
      .toHaveAttribute("aria-current", "page")
    await expect.element(getCurrentPageStatus()).toHaveTextContent("2")
  })

  test("prev trigger goes back and emits the page change", async () => {
    await render(ControlledPageThreePaginationComponent)

    await expect
      .element(getPageButton(3))
      .toHaveAttribute("aria-current", "page")

    await getPrevButton().click()

    await expect
      .element(getPageButton(2))
      .toHaveAttribute("aria-current", "page")
    await expect.element(getCurrentPageStatus()).toHaveTextContent("2")
  })

  test("prev trigger is disabled on the first page", async () => {
    await render(DefaultPaginationComponent)

    await expect.element(getPrevButton()).toBeDisabled()
    await expect.element(getNextButton()).not.toBeDisabled()
  })

  test("next trigger is disabled on the last page", async () => {
    await render(LastPagePaginationComponent)

    await expect.element(getNextButton()).toBeDisabled()
    await expect.element(getPrevButton()).not.toBeDisabled()
  })

  test("clicking a specific page number navigates to that page", async () => {
    await render(DefaultPaginationComponent)

    await expect
      .element(getPageButton(1))
      .toHaveAttribute("aria-current", "page")

    await getPageButton(3).click()

    await expect
      .element(getPageButton(3))
      .toHaveAttribute("aria-current", "page")
    await expect.element(getPageButton(1)).not.toHaveAttribute("aria-current")
  })

  test("controlled page reflects external state changes", async () => {
    await render(ExternallyControlledPaginationComponent)

    await expect.element(getCurrentPageStatus()).toHaveTextContent("1")

    await page.getByRole("button", {name: "Set page 4"}).click()

    await expect.element(getCurrentPageStatus()).toHaveTextContent("4")
    await expect
      .element(getPageButton(4))
      .toHaveAttribute("aria-current", "page")
  })

  test("defaultPage sets the initial rendered page", async () => {
    await render(DefaultPagePaginationComponent)

    await expect
      .element(getPageButton(5))
      .toHaveAttribute("aria-current", "page")
    await expect.element(getPageButton(1)).not.toHaveAttribute("aria-current")
  })

  test("single page disables both prev and next triggers", async () => {
    await render(SinglePagePaginationComponent)

    await expect.element(getPrevButton()).toBeDisabled()
    await expect.element(getNextButton()).toBeDisabled()
    await expect
      .element(getPageButton(1))
      .toHaveAttribute("aria-current", "page")
  })

  test("page metadata renders current page information from context", async () => {
    await render(PageInfoMetadataComponent)

    await expect.element(page.getByText("1 of 12")).toBeVisible()
  })

  test("page metadata supports a custom page range render", async () => {
    await render(PageRangeMetadataComponent)

    await expect
      .element(page.getByText("Showing 11-20 of 115 items"))
      .toBeVisible()
  })

  test("parts render correctly", async () => {
    const {container} = await render(PartsPaginationComponent)

    expect(container.querySelector(".qui-pagination__root")).toBeTruthy()
    expect(container.querySelector("q-pagination-page-items")).toBeTruthy()
    expect(
      container.querySelector(".qui-pagination__page-metadata"),
    ).toBeTruthy()
    expect(container.querySelector(".qui-pagination__page-size")).toBeTruthy()
    expect(
      container.querySelector(".qui-pagination__page-size-label"),
    ).toBeTruthy()
    await expect.element(getPrevButton()).toBeVisible()
    await expect.element(getNextButton()).toBeVisible()
    await expect.element(page.getByText("Items per page")).toBeVisible()
  })

  test("page size changes update page size state", async () => {
    await render(PageSizePaginationComponent)

    await expect.element(getCurrentPageSizeStatus()).toHaveTextContent("10")

    await page.getByRole("button", {name: "Items per page"}).click()
    await page.getByRole("menuitem", {name: "20"}).click()

    await expect.element(getCurrentPageSizeStatus()).toHaveTextContent("20")
  })

  test("keyboard Enter on a focused page item selects it", async () => {
    await render(ControlledPaginationComponent)

    const targetPage = getPageButton(3)
    targetPage.element().focus()
    await expect.element(targetPage).toHaveFocus()

    await userEvent.keyboard("{Enter}")

    await expect.element(getCurrentPageStatus()).toHaveTextContent("3")
    await expect
      .element(getPageButton(3))
      .toHaveAttribute("aria-current", "page")
  })

  test("keyboard Space on a focused page item selects it", async () => {
    await render(ControlledPaginationComponent)

    const targetPage = getPageButton(2)
    targetPage.element().focus()
    await expect.element(targetPage).toHaveFocus()

    await userEvent.keyboard("{Space}")

    await expect.element(getCurrentPageStatus()).toHaveTextContent("2")
    await expect
      .element(getPageButton(2))
      .toHaveAttribute("aria-current", "page")
  })
})
