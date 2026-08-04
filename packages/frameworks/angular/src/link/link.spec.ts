import {Component} from "@angular/core"
import {render} from "@testing-library/angular"
import {ExternalLink, Plus} from "lucide-angular"
import {describe, expect, test} from "vitest"
import {page} from "vitest/browser"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {EndIconDirective, StartIconDirective} from "@qualcomm-ui/angular/icon"
import {LinkDirective} from "@qualcomm-ui/angular/link"

describe("Link", () => {
  test("renders link content with generated start and end icons", async () => {
    @Component({
      imports: [LinkDirective],
      providers: [provideIcons({ExternalLink, Plus})],
      template: `
        <a endIcon="ExternalLink" href="/docs" q-link startIcon="Plus">
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
      providers: [provideIcons({ExternalLink, Plus})],
      template: `
        <a href="/docs" q-link>
          <svg icon="Plus" q-start-icon></svg>
          Custom docs
          <svg icon="ExternalLink" q-end-icon></svg>
        </a>
      `,
    })
    class ProjectedIconLinkComponent {}

    await render(ProjectedIconLinkComponent)

    const link = page.getByRole("link", {name: "Custom docs"})
    expect(link.element().querySelectorAll("svg")).toHaveLength(2)
  })
})
