import {Component, computed, type ElementRef, viewChild} from "@angular/core"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"
import type {PositioningOptions} from "@qualcomm-ui/dom/floating-ui"

@Component({
  imports: [MenuModule, PortalComponent],
  selector: "menu-anchor-point-demo",
  template: `
    <div class="flex flex-col gap-4">
      <q-menu [positioning]="positioning()">
        <button emphasis="primary" q-menu-button variant="fill">
          Show Menu
        </button>
        <div
          #anchorRef
          class="font-body-lg text-neutral-primary bg-neutral-04 border-neutral-01 rounded-md border p-4"
        >
          Anchor
        </div>
        <q-portal>
          <div q-menu-positioner>
            <div q-menu-content>
              <button q-menu-item value="new-text-file">New Text File</button>
              <button q-menu-item value="new-file">New File...</button>
              <button q-menu-item value="open-file">Open File...</button>
              <button q-menu-item value="export">Export</button>
            </div>
          </div>
        </q-portal>
      </q-menu>
    </div>
  `,
})
export class MenuAnchorPointDemo {
  protected readonly anchorRef =
    viewChild.required<ElementRef<HTMLDivElement>>("anchorRef")

  protected readonly positioning = computed<PositioningOptions>(() => ({
    getAnchorRect: () => this.anchorRef().nativeElement.getBoundingClientRect(),
  }))
}
