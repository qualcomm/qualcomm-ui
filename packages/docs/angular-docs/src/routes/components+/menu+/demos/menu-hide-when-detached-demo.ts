import {Component, signal} from "@angular/core"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {IntersectionObserverDirective} from "@qualcomm-ui/angular-core/observers"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, PortalComponent, IntersectionObserverDirective],
  selector: "menu-hide-when-detached-demo",
  template: `
    <q-menu [open]="open()" [positioning]="{hideWhenDetached: true}">
      <div
        class="border-neutral-03 flex max-w-72 gap-2 overflow-x-scroll rounded-md border p-4"
      >
        @for (item of items; track item) {
          <div
            class="font-body-md text-neutral-primary border-neutral-01 bg-neutral-04 rounded-md border p-3 whitespace-nowrap"
          >
            Item {{ item }}
          </div>
        }
        <button
          class="whitespace-nowrap"
          emphasis="primary"
          q-menu-button
          variant="fill"
          (qIntersectionObserver)="handleIntersection($event)"
        >
          Show Menu
        </button>
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
  `,
})
export class MenuHideWhenDetachedDemo {
  items = [...Array(6).keys()]

  readonly open = signal(false)

  handleIntersection(entries: IntersectionObserverEntry[]) {
    if (entries[0]?.isIntersecting) {
      // only open the menu when the button is in view,
      // but keep it open after to demonstrate the use case.
      this.open.set(true)
    }
  }
}
