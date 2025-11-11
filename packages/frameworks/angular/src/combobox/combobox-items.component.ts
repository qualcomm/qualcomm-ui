// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {useComboboxContext} from "@qualcomm-ui/angular-core/combobox"

@Component({
  selector: "q-combobox-items",
  standalone: false,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  template: `
    @for (
      item of comboboxContext().collection.items;
      track comboboxContext().collection.getItemValue(item)
    ) {
      <div q-combobox-item [item]="item">
        <span q-combobox-item-text>
          {{ comboboxContext().collection.stringifyItem(item) }}
        </span>
        <span q-combobox-item-indicator></span>
      </div>
    }
  `,
})
export class ComboboxItemsComponent {
  protected readonly comboboxContext = useComboboxContext()
}
