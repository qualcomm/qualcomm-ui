import {Component} from "@angular/core"
import {Code, Cpu, FileText, Smartphone} from "lucide-angular"

import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import type {QdsTabsSize} from "@qualcomm-ui/qds-core/tabs"

@Component({
  imports: [TabsModule],
  providers: [provideIcons({Code, Cpu, FileText, Smartphone})],
  selector: "tabs-line-sizes-demo",
  template: `
    <div class="flex flex-col gap-4">
      @for (size of sizes; track size) {
        <div class="flex items-center gap-4">
          <div class="font-heading-xs text-neutral-primary w-16">
            {{ size }}
          </div>
          <div defaultValue="documents" q-tabs-root [size]="size">
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
          </div>
        </div>
      }
    </div>
  `,
})
export class TabsLineSizesDemo {
  protected sizes: QdsTabsSize[] = ["sm", "md", "lg", "xl"]
}
