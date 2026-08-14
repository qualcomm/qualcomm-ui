import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {Search} from "@lucide/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {
  EndIconDirective,
  IconDirective,
  StartIconDirective,
} from "@qualcomm-ui/angular/icon"

describe("Icon", () => {
  test("renders a qIcon from an injected icon name", async () => {
    @Component({
      imports: [IconDirective],
      providers: [provideIcons({Search})],
      template: `
        <svg data-test-id="search-icon" qIcon="Search" size="lg"></svg>
      `,
    })
    class NamedIconComponent {}

    await render(NamedIconComponent)

    const icon = page.getByTestId("search-icon")
    expect(icon.element().querySelector("path")).toBeTruthy()
    expect(icon).toHaveAttribute("data-size", "lg")
    expect(icon).toHaveAttribute("xmlns", "http://www.w3.org/2000/svg")
  })

  test("renders start and end icon directives when given icon content", async () => {
    @Component({
      imports: [EndIconDirective, StartIconDirective],
      providers: [provideIcons({Search})],
      template: `
        <span data-test-id="start-icon" icon="Search" q-start-icon></span>
        <span data-test-id="end-icon" icon="Search" q-end-icon></span>
      `,
    })
    class ProjectedIconComponent {}

    await render(ProjectedIconComponent)

    expect(
      page.getByTestId("start-icon").element().querySelector("svg"),
    ).toBeTruthy()
    expect(
      page.getByTestId("end-icon").element().querySelector("svg"),
    ).toBeTruthy()
  })
})
