import {Component} from "@angular/core"

import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

/**
 * A helper component that combines the portal, positioner, and content
 * components.
 */
@Component({
  selector: "q-drawer-floating-portal",
  standalone: false,
  template: `
    <ng-template #children>
      <div q-drawer-backdrop></div>
      <div q-drawer-positioner>
        <section q-drawer-content>
          <ng-content />
        </section>
      </div>
    </ng-template>

    @if (disabled()) {
      <ng-template [ngTemplateOutlet]="children" />
    } @else {
      <ng-template #tpl cdkPortal>
        <ng-template [ngTemplateOutlet]="children" />
      </ng-template>
    }
  `,
})
export class DrawerFloatingPortalComponent extends PortalComponent {}
