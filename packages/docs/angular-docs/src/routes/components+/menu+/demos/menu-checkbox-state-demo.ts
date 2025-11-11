import {Component} from "@angular/core"

import {MenuModule} from "@qualcomm-ui/angular/menu"
import {useCheckboxGroup} from "@qualcomm-ui/angular-core/checkbox"
import {PortalComponent} from "@qualcomm-ui/angular-core/portal"

@Component({
  imports: [MenuModule, PortalComponent],
  selector: "menu-checkbox-state-demo",
  template: `
    <q-menu>
      <button emphasis="primary" q-menu-button variant="fill">Show Menu</button>
      <q-portal>
        <div q-menu-positioner>
          <div q-menu-content>
            <!-- preview -->
            <div q-menu-item-group>
              <label q-menu-item-group-label>Choose an option</label>
              @for (item of items; track item.value) {
                <button
                  q-menu-checkbox-item
                  [checked]="checkboxGroup.isChecked(item.value)"
                  [value]="item.value"
                  (checkedChanged)="checkboxGroup.toggleValue(item.value)"
                >
                  {{ item.label }}
                  <div q-menu-item-indicator></div>
                </button>
              }
            </div>
            <!-- preview -->
          </div>
        </div>
      </q-portal>
    </q-menu>
  `,
})
export class MenuCheckboxStateDemo {
  readonly checkboxGroup = useCheckboxGroup({defaultValue: ["option-1"]})

  readonly items = [
    {
      label: "Option 1",
      value: "option-1",
    },
    {
      label: "Option 2",
      value: "option-2",
    },
    {
      label: "Option 3",
      value: "option-3",
    },
  ]
}
