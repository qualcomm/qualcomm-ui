import {Component} from "@angular/core"

import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

/**
 * A helper component that combines the portal, positioner, content, and arrow
 * components.
 *
 * @remarks
 * This is equivalent to:
 * ```angular-html
 * <q-portal>
 *   <div q-tooltip-positioner>
 *     <div q-tooltip-content>
 *       <div q-tooltip-arrow>
 *         <div q-tooltip-arrow-tip></div>
 *       </div>
 *       <ng-content />
 *     </div>
 *   </div>
 * </q-portal>
 * ```
 */
@Component({
  selector: "q-tooltip-floating-portal",
  standalone: false,
  template: `
    <ng-template #children>
      <div q-tooltip-positioner>
        <div q-tooltip-content>
          <div q-tooltip-arrow>
            <div q-tooltip-arrow-tip></div>
          </div>
          <ng-content />
        </div>
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
export class TooltipFloatingPortalComponent extends PortalComponent {}
