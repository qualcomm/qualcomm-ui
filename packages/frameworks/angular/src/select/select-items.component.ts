// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {Component} from "@angular/core"

import {useSelectContext} from "@qualcomm-ui/angular-core/select"

@Component({
  selector: "q-select-items",
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
      item of selectContext().collection.items;
      track selectContext().collection.getItemValue(item)
    ) {
      <div q-select-item [item]="item">
        <span q-select-item-text>
          {{ selectContext().collection.stringifyItem(item) }}
        </span>
        <span q-select-item-indicator></span>
      </div>
    }
  `,
})
export class SelectItemsComponent {
  protected readonly selectContext = useSelectContext()
}
