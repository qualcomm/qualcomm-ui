import {Component, signal} from "@angular/core"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import type {FilterSetOptionCounts} from "@qualcomm-ui/core/filter-set"
import {defineFilters, listFilter} from "@qualcomm-ui/core/filters"
import {ListCollection} from "@qualcomm-ui/utils/collection"

import {useFilterSet} from "./use-filter-set"

const filters = defineFilters({
  owner: listFilter({label: "Owner"}),
})

@Component({
  template: `
    <output aria-label="Options">
      {{ filterSet().getFilterCollection("owner")?.items?.join(",") || "none" }}
    </output>
    <output aria-label="Counts">
      {{ counts() }}
    </output>
    <button (click)="load()">Load</button>
  `,
})
class LoadedResolverComponent {
  readonly owners = signal<ListCollection<string> | undefined>(undefined)
  readonly ownerCounts = signal<FilterSetOptionCounts | undefined>(undefined)

  readonly filterSet = useFilterSet({
    filters,
    getFilterCollection: () => this.owners(),
    getFilterOptionCounts: () => this.ownerCounts(),
  })

  counts() {
    return JSON.stringify(this.filterSet().getFilterOptionCounts("owner") ?? {})
  }

  load() {
    this.owners.set(new ListCollection({items: ["Ada", "Grace"]}))
    this.ownerCounts.set({Ada: 2, Grace: 5})
  }
}

describe("useFilterSet", () => {
  test("re-resolves collections and option counts when the signals a resolver reads change", async () => {
    await render(LoadedResolverComponent)

    await expect
      .element(page.getByRole("status", {name: "Options"}))
      .toHaveTextContent("none")

    await page.getByRole("button", {name: "Load"}).click()

    await expect
      .element(page.getByRole("status", {name: "Options"}))
      .toHaveTextContent("Ada,Grace")
    await expect
      .element(page.getByRole("status", {name: "Counts"}))
      .toHaveTextContent('{"Ada":2,"Grace":5}')
  })
})
