import {Component} from "@angular/core"
import {Code, Cpu, FileText, Smartphone} from "lucide-angular"

import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {QdsTabsSize} from "@qualcomm-ui/qds-core/tabs"

@Component({
  imports: [TabsModule],
  providers: [provideIcons({Code, Cpu, FileText, Smartphone})],
  selector: "tabs-contained-sizes-demo",
  template: `
    <div class="flex flex-col gap-6">
      <!-- preview -->
      @for (size of sizes; track size) {
        <div
          defaultValue="documents"
          q-tabs-root
          variant="contained"
          [size]="size"
        >
          <div q-tabs-list>
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
        </div>
      }
      <!-- preview -->
    </div>
  `,
})
export class TabsContainedSizesDemo {
  protected sizes: QdsTabsSize[] = ["sm", "md"]
}
