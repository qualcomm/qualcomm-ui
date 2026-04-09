import {Component} from "@angular/core"
import {Home} from "lucide-angular"

import {
  type BreadcrumbsItemData,
  BreadcrumbsModule,
} from "@qualcomm-ui/angular/breadcrumbs"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

// preview
@Component({
  imports: [BreadcrumbsModule],
  providers: [provideIcons({Home})],
  selector: "breadcrumbs-auto-overflow-demo",
  template: `
    <div style="max-width: 600px; resize: horizontal; overflow: auto">
      <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
        <ol maxItems="auto" q-breadcrumbs-list [items]="items"></ol>
      </nav>
    </div>
  `,
})
export class BreadcrumbsAutoOverflowDemo {
  readonly items: BreadcrumbsItemData[] = [
    {icon: "Home", label: "Home", link: "/"},
    {label: "Settings", link: "/settings"},
    {label: "Account", link: "/settings/account"},
    {label: "Security", link: "/settings/account/security"},
    {label: "Two-Factor Authentication"},
  ]
}
// preview
