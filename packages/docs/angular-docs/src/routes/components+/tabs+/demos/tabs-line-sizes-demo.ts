import {Component} from "@angular/core"
import {
  LucideCode,
  LucideCpu,
  LucideFileText,
  LucideSmartphone,
} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {TabsModule} from "@qualcomm-ui/angular/tabs"
import type {QdsTabsSize} from "@qualcomm-ui/qds-core/tabs"

@Component({
  imports: [TabsModule],
  providers: [
    provideIcons({LucideCode, LucideCpu, LucideFileText, LucideSmartphone}),
  ],
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
                <button endIcon="LucideFileText" q-tab-button>Documents</button>
              </div>
              <div q-tab-root value="products">
                <button endIcon="Smartphone" q-tab-button>Products</button>
              </div>
              <div q-tab-root value="software">
                <button endIcon="Code" q-tab-button>Software</button>
              </div>
              <div q-tab-root value="hardware">
                <button endIcon="Cpu" q-tab-button>Hardware</button>
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
