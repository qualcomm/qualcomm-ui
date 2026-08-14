// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component, computed, inject, type OnInit} from "@angular/core"
import {LucideChevronDown, LucideChevronUp} from "@lucide/angular"

import {provideIcons} from "@qualcomm-ui/angular-core/lucide"
import {normalizeProps} from "@qualcomm-ui/angular-core/machine"
import {
  CoreMenuRootDirective,
  provideMenuContext,
  provideMenuMachineContext,
  provideMenuTriggerContext,
  useMenuContext,
} from "@qualcomm-ui/angular-core/menu"
import {useNumberInputContext} from "@qualcomm-ui/angular-core/number-input"
import {providePresenceContext} from "@qualcomm-ui/angular-core/presence"
import {
  provideQdsMenuContext,
  QdsMenuContextService,
} from "@qualcomm-ui/angular/menu"
import {createQdsMenuApi} from "@qualcomm-ui/qds-core/menu"

import {useQdsNumberInputContext} from "./qds-number-input-context.service"

@Component({
  providers: [
    provideMenuContext(),
    provideMenuTriggerContext(),
    provideMenuMachineContext(),
    providePresenceContext(),
    provideQdsMenuContext(),
    provideIcons({LucideChevronDown, LucideChevronUp}),
  ],
  selector: "q-number-input-unit-select",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    <button q-menu-trigger [q-bind]="unitSelectBindings()">
      <span>{{ selectedLabel() }}</span>
      <svg
        data-number-input-part="chevron"
        size="sm"
        [qIcon]="menuContext().open ? 'ChevronUp' : 'LucideChevronDown'"
      ></svg>
    </button>
    <ng-template qPortal>
      <div q-menu-positioner>
        <div q-menu-content>
          <div
            q-menu-radio-item-group
            [value]="numberInputContext().unit"
            (valueChange)="onUnitChange($event)"
          >
            @for (
              option of numberInputContext().unitOptions ?? [];
              track option.value
            ) {
              <button q-menu-radio-item [value]="option.value">
                <span q-menu-item-label>
                  {{ option.displayText ?? option.label }}
                </span>
                <span q-menu-item-indicator></span>
              </button>
            }
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class NumberInputUnitSelectComponent
  extends CoreMenuRootDirective
  implements OnInit
{
  protected readonly numberInputContext = useNumberInputContext()
  protected readonly qdsNumberInputContext = useQdsNumberInputContext()
  protected readonly qdsMenuService = inject(QdsMenuContextService)
  protected readonly menuContext = useMenuContext()

  protected readonly unitSelectBindings = computed(() => ({
    ...this.numberInputContext().getUnitSelectBindings(),
    ...this.qdsNumberInputContext().getUnitSelectBindings(),
  }))

  protected readonly selectedLabel = computed(() => {
    const currentValue = this.numberInputContext().unit
    const opts = this.numberInputContext().unitOptions
    const selected = opts?.find((opt) => opt.value === currentValue)
    return selected?.label ?? ""
  })

  protected onUnitChange(value: string | undefined): void {
    if (value) {
      this.numberInputContext().setUnit(value)
    }
  }

  override ngOnInit() {
    super.ngOnInit()

    const qdsMenuApi = computed(() => {
      const inputSize = this.qdsNumberInputContext().size
      const menuSize = inputSize === "lg" ? "md" : inputSize
      return createQdsMenuApi({size: menuSize}, normalizeProps)
    })

    this.qdsMenuService.init(qdsMenuApi)
  }
}
