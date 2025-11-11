import {Component, signal} from "@angular/core"
import {ChevronLeft, ChevronRight} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TabsModule, ButtonModule],
  providers: [provideIcons({ChevronLeft, ChevronRight})],
  selector: "tabs-controlled-value-demo",
  template: `
    <div q-tabs-root [value]="value()" (valueChanged)="value.set($event)">
      <div q-tabs-list>
        <div q-tabs-indicator></div>
        <div q-tab-root value="software">
          <button q-tab-button>Software</button>
        </div>
        <div q-tab-root value="hardware">
          <button q-tab-button>Hardware</button>
        </div>
      </div>
      <div q-tabs-panel value="software">
        <div class="flex flex-col gap-4">
          <div>Software Panel</div>
          <button
            emphasis="primary"
            endIcon="ChevronRight"
            q-button
            size="sm"
            (click)="goToHardwareTab()"
          >
            View Hardware
          </button>
        </div>
      </div>
      <div q-tabs-panel value="hardware">
        <div class="flex flex-col gap-4">
          <div>Hardware Panel</div>
          <button
            emphasis="primary"
            q-button
            size="sm"
            startIcon="ChevronLeft"
            (click)="goToSoftwareTab()"
          >
            View Software
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TabsControlledValueDemo {
  protected readonly value = signal<string>("software")

  protected goToSoftwareTab() {
    this.value.set("software")
  }

  protected goToHardwareTab() {
    this.value.set("hardware")
  }
}
