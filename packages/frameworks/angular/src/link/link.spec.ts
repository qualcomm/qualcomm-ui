import {Component} from "@angular/core"
import {LucideExternalLink, LucidePlus} from "@lucide/angular"
import {render} from "@testing-library/angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {EndIconDirective, StartIconDirective} from "@qualcomm-ui/angular/icon"
import {LinkDirective} from "@qualcomm-ui/angular/link"

describe("Link", () => {
  test("renders link content with generated start and end icons", async () => {
    @Component({
      imports: [LinkDirective],
      providers: [provideIcons({LucideExternalLink, LucidePlus})],
      template: `
        <a endIcon="LucideExternalLink" href="/docs" q-link startIcon="Plus">
          Documentation
        </a>
      `,
    })
    class LinkWithIconsComponent {}

    await render(LinkWithIconsComponent)

    const link = page.getByRole("link", {name: "Documentation"})
    await expect.element(link).toBeVisible()
    expect(link.element().querySelectorAll("svg")).toHaveLength(2)
  })

  test("uses projected start and end icon elements", async () => {
    @Component({
      imports: [EndIconDirective, LinkDirective, StartIconDirective],
      providers: [provideIcons({LucideExternalLink, LucidePlus})],
      template: `
        <a href="/docs" q-link>
          <svg icon="Plus" q-start-icon></svg>
          Custom docs
          <svg icon="LucideExternalLink" q-end-icon></svg>
        </a>
      `,
    })
    class ProjectedIconLinkComponent {}

    await render(ProjectedIconLinkComponent)

    const link = page.getByRole("link", {name: "Custom docs"})
    expect(link.element().querySelectorAll("svg")).toHaveLength(2)
  })
})
