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
  selector: "breadcrumbs-max-items-demo",
  template: `
    <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
      <ol q-breadcrumbs-list [items]="items" [maxItems]="3"></ol>
    </nav>
  `,
})
export class BreadcrumbsMaxItemsDemo {
  readonly items: BreadcrumbsItemData[] = [
    {icon: "Home", label: "Home", link: "/"},
    {label: "Settings", link: "/settings"},
    {label: "Account", link: "/settings/account"},
    {label: "Security", link: "/settings/account/security"},
    {label: "Sessions"},
  ]
}
// preview
