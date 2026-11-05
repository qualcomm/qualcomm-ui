import {Component, input, signal} from "@angular/core"

import {PortalDirective} from "@qualcomm-ui/angular-core/portal"
import {ButtonModule} from "@qualcomm-ui/angular/button"
import {MenuModule} from "@qualcomm-ui/angular/menu"

@Component({
  imports: [ButtonModule, MenuModule, PortalDirective],
  selector: "menu-header-footer-filter-menu",
  template: `
    <q-menu
      [closeOnSelect]="false"
      [open]="open()"
      [size]="size()"
      (openChanged)="open.set($event)"
    >
      <button emphasis="primary" q-menu-button>{{ label() }}</button>
      <ng-container *qPortal>
        <div q-menu-positioner>
          <!-- preview -->
          <div q-menu-header>
            <div q-menu-header-label>
              Applied filters: {{ selectedFilters().length }}
            </div>
            <button
              emphasis="primary"
              q-button
              type="button"
              (click)="selectedFilters.set([])"
            >
              Clear all
            </button>
          </div>
          <div q-menu-content [style.maxHeight.px]="200">
            @for (filter of filters; track filter.value) {
              <button
                q-menu-checkbox-item
                [checked]="selectedFilters().includes(filter.value)"
                [value]="filter.value"
                (checkedChanged)="onCheckedChange(filter.value, $event)"
              >
                <div q-menu-checkbox-item-control></div>
                <div q-menu-item-label>{{ filter.label }}</div>
              </button>
            }
          </div>
          <div q-menu-footer>
            <button
              emphasis="neutral"
              q-button
              type="button"
              variant="fill"
              (click)="open.set(false)"
            >
              Apply Filters
            </button>
          </div>
          <!-- preview -->
        </div>
      </ng-container>
    </q-menu>
  `,
})
export class FilterMenu {
  readonly label = input.required<string>()
  readonly size = input.required<"sm" | "md">()

  protected readonly filters = [
    {label: "Project name", value: "project"},
    {label: "Status", value: "status"},
    {label: "Owner", value: "owner"},
    {label: "Team", value: "team"},
    {label: "Region", value: "region"},
    {label: "Start date", value: "start-date"},
    {label: "Due date", value: "due-date"},
    {label: "Last updated", value: "updated"},
  ]
  protected readonly open = signal(false)
  protected readonly selectedFilters = signal(["project", "status", "owner"])

  protected onCheckedChange(value: string, checked: boolean | undefined) {
    this.selectedFilters.update((previous) =>
      checked
        ? [...previous, value]
        : previous.filter((item) => item !== value),
    )
  }
}

@Component({
  imports: [FilterMenu],
  selector: "menu-header-footer-demo",
  template: `
    <div class="flex items-center gap-4">
      <menu-header-footer-filter-menu label="Small menu" size="sm" />
      <menu-header-footer-filter-menu label="Medium menu" size="md" />
    </div>
  `,
})
export class MenuHeaderFooterDemo {}
