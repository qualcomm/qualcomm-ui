import {Component} from "@angular/core"
import {ChevronLeft, ChevronRight} from "lucide-angular"

import {ButtonModule} from "@qualcomm-ui/angular/button"
import {TabsModule} from "@qualcomm-ui/angular/tabs"
import {provideIcons} from "@qualcomm-ui/angular-core/lucide"

@Component({
  imports: [TabsModule, ButtonModule],
  providers: [provideIcons({ChevronLeft, ChevronRight})],
  selector: "tabs-context-demo",
  template: `
    <div class="w-full" defaultValue="tab-1" q-tabs-root>
      <div q-tabs-list>
        <div q-tabs-indicator></div>
        <div q-tab-root value="tab-1">
          <button q-tab-button>Tab 1</button>
        </div>
        <div q-tab-root value="tab-2">
          <button q-tab-button>Tab 2</button>
        </div>
        <div q-tab-root value="tab-3">
          <button q-tab-button>Tab 3</button>
        </div>
      </div>
      <!-- preview -->
      <ng-container *tabsContext="let tabsApi">
        <div q-tabs-panel value="tab-1">
          <button
            endIcon="ChevronRight"
            q-button
            size="sm"
            variant="outline"
            (click)="tabsApi.setValue('tab-2')"
          >
            Go to next tab
          </button>
        </div>
        <div class="flex items-center gap-2" q-tabs-panel value="tab-2">
          <button
            q-button
            size="sm"
            startIcon="ChevronLeft"
            variant="outline"
            (click)="tabsApi.setValue('tab-1')"
          >
            Go to prev tab
          </button>
          <button
            endIcon="ChevronRight"
            q-button
            size="sm"
            variant="outline"
            (click)="tabsApi.setValue('tab-3')"
          >
            Go to next tab
          </button>
        </div>
        <div q-tabs-panel value="tab-3">
          <button
            q-button
            size="sm"
            startIcon="ChevronLeft"
            variant="outline"
            (click)="tabsApi.setValue('tab-2')"
          >
            Go to previous tab
          </button>
        </div>
      </ng-container>

      <!-- preview -->
    </div>
  `,
})
export class TabsContextDemo {}
