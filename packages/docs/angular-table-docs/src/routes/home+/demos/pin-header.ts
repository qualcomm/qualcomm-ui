import {Component, inject} from "@angular/core"
import {LucideSettings2} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {MenuModule} from "@qualcomm-ui/angular/menu"
import {
  HeaderComponentContextDirective,
  TableModule,
} from "@qualcomm-ui/angular/table"

import type {User} from "./data"
import {RowPinningService} from "./row-pinning.service"

@Component({
  imports: [MenuModule, PortalDirective, TableModule],
  providers: [provideIcons({LucideSettings2})],
  selector: "app-pin-header",
  template: `
    <div class="flex items-center gap-2">
      <span>Pin</span>
      <q-menu size="sm">
        <button
          aria-label="Row pinning settings"
          icon="Settings2"
          q-menu-trigger
          q-table-column-header-action
        ></button>
        <ng-container *qPortal>
          <div q-menu-positioner>
            <div q-menu-content>
              <button
                q-menu-checkbox-item
                value="include-parent-rows"
                [checked]="rowPinningService.includeParentRows()"
                (checkedChanged)="
                  rowPinningService.includeParentRows.set(!!$event)
                "
              >
                <div q-menu-checkbox-item-control></div>
                <div q-menu-item-label>
                  Include Parent Rows When Pinning Child
                </div>
              </button>
              <button
                q-menu-checkbox-item
                value="include-leaf-rows"
                [checked]="rowPinningService.includeLeafRows()"
                (checkedChanged)="
                  rowPinningService.includeLeafRows.set(!!$event)
                "
              >
                <div q-menu-checkbox-item-control></div>
                <div q-menu-item-label>
                  Include Leaf Rows When Pinning Parent
                </div>
              </button>
              <button
                q-menu-checkbox-item
                value="keep-pinned-rows"
                [checked]="rowPinningService.keepPinnedRows()"
                (checkedChanged)="
                  rowPinningService.keepPinnedRows.set(!!$event)
                "
              >
                <div q-menu-checkbox-item-control></div>
                <div q-menu-item-label>
                  Persist Pinned Rows across Pagination and Filtering
                </div>
              </button>
            </div>
          </div>
        </ng-container>
      </q-menu>
    </div>
  `,
})
export class PinHeader extends HeaderComponentContextDirective<User> {
  protected readonly rowPinningService = inject(RowPinningService)
}
