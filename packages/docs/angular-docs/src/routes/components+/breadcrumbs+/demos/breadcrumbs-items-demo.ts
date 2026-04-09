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
  selector: "breadcrumbs-items-demo",
  template: `
    <nav aria-label="Breadcrumbs" q-breadcrumbs-root>
      <ol q-breadcrumbs-list [items]="items"></ol>
    </nav>
  `,
})
export class BreadcrumbsItemsDemo {
  readonly items: BreadcrumbsItemData[] = [
    {href: "/", icon: "Home", label: "Home"},
    {href: "/components", label: "Components"},
    {label: "Breadcrumbs"},
  ]
}
// preview
