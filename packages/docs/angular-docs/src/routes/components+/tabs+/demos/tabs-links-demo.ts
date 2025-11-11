import {Component, inject, signal} from "@angular/core"
import {takeUntilDestroyed} from "@angular/core/rxjs-interop"
import {ActivatedRoute, Router} from "@angular/router"

import {TabsModule} from "@qualcomm-ui/angular/tabs"

const tabValues = ["documents", "products", "software", "hardware"]

@Component({
  imports: [TabsModule],
  selector: "tabs-links-demo",
  template: `
    <div q-tabs-root [value]="value()" (valueChanged)="handleTabChange($event)">
      <div q-tabs-list>
        <div q-tabs-indicator></div>
        <div q-tab-root value="documents">
          <button q-tab-button>Documents</button>
        </div>
        <div q-tab-root value="products">
          <button q-tab-button>Products</button>
        </div>
        <div q-tab-root value="software">
          <button q-tab-button>Software</button>
        </div>
        <div q-tab-root value="hardware">
          <button q-tab-button>Hardware</button>
        </div>
      </div>
      <div q-tabs-panel value="documents">Documents</div>
      <div q-tabs-panel value="products">Products</div>
      <div q-tabs-panel value="software">Software</div>
      <div q-tabs-panel value="hardware">Hardware</div>
    </div>
  `,
})
export class TabsLinksDemo {
  protected readonly value = signal<string>("documents")
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  constructor() {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      const tab = params["tab"] || "documents"
      if (tabValues.includes(tab)) {
        this.value.set(tab)
      }
    })
  }

  handleTabChange(newValue: string) {
    this.value.set(newValue)
    this.router.navigate([], {
      queryParams: {tab: newValue},
      queryParamsHandling: "merge",
    })
  }
}
